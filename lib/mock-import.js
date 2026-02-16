import {createRequire, isBuiltin} from 'node:module';
import process from 'node:process';
import {tryCatch} from 'try-catch';
import {convertImports} from './convert-imports/index.js';
import {convertTracedImports} from './convert-traced-imports/index.js';
import {traceImports} from './trace-imports/index.js';

globalThis.__mockImportCounter = globalThis.__mockImportCounter || 0;
globalThis.__mockImportCache = globalThis.__mockImportCache || new Map();
globalThis.__mockImportReImports = globalThis.__mockImportReImports || new Set();

globalThis.__traceImportCache = globalThis.__traceImportCache || new Map();
globalThis.__nextCount = () => ++globalThis.__mockImportCounter;
globalThis.__reImport = async (moduleUrl, url) => {
    const {resolve} = createRequire(url);
    const reFn = reImport({
        resolve,
    });
    
    return await reFn(moduleUrl);
};

globalThis.__mockImportNested = Boolean(process.env.MOCK_IMPORT_NESTED);

const cache = globalThis.__mockImportCache;

const traceCache = globalThis.__traceImportCache;
const reImports = globalThis.__mockImportReImports;
const nextCount = globalThis.__nextCount;

export const enableNestedImports = () => {
    globalThis.__mockImportNested = true;
    globalThis.__mockImportLoader.enableNestedImports();
};

export const disableNestedImports = () => {
    globalThis.__mockImportNested = false;
    globalThis.__mockImportLoader.disableNestedImports();
};

export const createMockImport = (url) => {
    const {resolve} = createRequire(url);
    
    return {
        mockImport: mockImport({
            resolve,
        }),
        reImport: reImport({
            resolve,
        }),
        reImportDefault: reImportDefault({
            resolve,
        }),
        traceImport: traceImport({
            resolve,
        }),
        reTrace: reTrace({
            resolve,
        }),
        stop: stop({
            resolve,
        }),
        stopAll,
    };
};

export {initialize} from './loader.js';

function transform({url, source, pathname, resolve}) {
    let code = source;
    
    if (reImports.has(pathname)) {
        const [sourceFileName] = String(url).split('?');
        
        code = convertImports({
            sourceFileName,
            resolve,
            source: code,
            cache,
            nested: globalThis.__mockImportNested,
        });
    }
    
    if (traceCache.has(pathname)) {
        const stack = traceCache.get(pathname);
        
        code = traceImports({
            url,
            stack,
            source: code,
        });
    }
    
    if (traceCache.size)
        code = convertTracedImports({
            source: code,
            resolve,
            traceCache,
            nextCount,
        });
    
    return code;
}

export async function load(url, context, defaultLoad) {
    const {pathname} = new URL(url);
    const {format, source: rawSource} = await defaultLoad(url, context, defaultLoad);
    const source = String(rawSource);
    
    if (format === 'commonjs')
        return {
            format,
        };
    
    if (url.startsWith('node:'))
        return {
            source,
            format,
        };
    
    const {resolve} = createRequire(pathname);
    
    const code = transform({
        url,
        source,
        pathname,
        resolve,
    });
    
    return {
        source: code,
        format,
    };
}

const traceImport = ({resolve}) => (name, {stack}) => {
    const [, pathname = name] = tryCatch(resolve, name);
    traceCache.set(pathname, stack);
    globalThis.__mockImportLoader.setTraceCache(pathname);
};

const reTrace = ({resolve}) => async (name) => {
    const pathname = resolve(name);
    return await import(`${pathname}?mock-import-count=${nextCount()}`);
};

const mockImport = ({resolve}) => (name, data) => {
    const [, pathname = name] = tryCatch(resolve, name);
    cache.set(pathname, data);
    globalThis.__mockImportLoader.setCache(pathname);
};

const reImport = ({resolve}) => async (name) => {
    if (isBuiltin(name))
        return await import(name);
    
    const pathname = resolve(name);
    
    reImports.add(pathname);
    globalThis.__mockImportLoader.addReImport(pathname);
    
    return await import(`${pathname}?mock-import-count=${nextCount()}`);
};

const reImportDefault = ({resolve}) => async (name) => {
    const imported = await reImport({
        resolve,
    })(name);
    
    return imported.default;
};

const stop = ({resolve}) => (name) => {
    const pathname = resolve(name);
    cache.delete(pathname);
    globalThis.__mockImportLoader.stopCache(pathname);
};

const stopAll = () => {
    cache.clear();
    reImports.clear();
    traceCache.clear();
    globalThis.__mockImportLoader.stopAll();
};
