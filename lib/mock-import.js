import {readFile} from 'fs/promises';
import {createRequire} from 'module';
import convertImports from './convert-imports/index.js';
import convertTracedImports from './convert-traced-imports/index.js';
import traceImports from './trace-imports/index.js';
import tryCatch from 'try-catch';

global.__mockImportCache = global.__mockImportCache || new Map();
global.__mockImportReImports = global.__mockImportReImports || new Set();
global.__mockImportCounter = global.__mockImportCounter || 0;

global.__traceImportCache = global.__traceImportCache || new Map();
global.__nextCount = () => ++global.__mockImportCounter;
global.__reImport = async (moduleUrl, url) => {
    const {resolve} = createRequire(url);
    const reFn = reImport({
        resolve,
    });
    
    return await reFn(moduleUrl);
};

const traceCache = global.__traceImportCache;
const cache = global.__mockImportCache;
const reImports = global.__mockImportReImports;
const nextCount = global.__nextCount;

export const createMockImport = (url) => {
    const {resolve} = createRequire(url);
    
    return {
        mockImport: mockImport({resolve}),
        reImport: reImport({resolve}),
        reImportDefault: reImportDefault({resolve}),
        traceImport: traceImport({resolve}),
        reTrace: reTrace({resolve}),
        stop: stop({resolve}),
        stopAll,
    };
};

function transform({url, source, pathname, resolve}) {
    let code = source;
    
    if (reImports.has(pathname)) {
        code = convertImports({
            resolve,
            source: code,
            cache,
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

// node v16.12
export async function load(url, context, defaultLoad) {
    const {pathname} = new URL(url);
    const [error, result] = tryCatch(createRequire, pathname);
    
    if (error)
        return defaultLoad(url, context, defaultLoad);
    
    const {resolve} = result;
    const resolved = resolve(pathname);
    
    const source = await readFile(resolved, 'utf8');
    const code = transform({
        url,
        source,
        pathname,
        resolve,
    });
    
    if (code !== String(source))
        return {
            source: code,
            format: 'module',
        };
    
    return await defaultLoad(url, context, defaultLoad);
}

export async function transformSource(source, context, defaultTransformSource) {
    const {url} = context;
    const {pathname} = new URL(url);
    const {resolve} = createRequire(pathname);
    
    const code = transform({
        url,
        source: source.toString(),
        resolve,
        pathname,
    });
    
    if (code !== String(source))
        return {
            source: code,
        };
    
    return await defaultTransformSource(source, context, defaultTransformSource);
}

const traceImport = ({resolve}) => (name, {stack}) => {
    const [, pathname = name] = tryCatch(resolve, name);
    traceCache.set(pathname, stack);
};

const reTrace = ({resolve}) => async (name) => {
    const pathname = resolve(name);
    return await import(`${pathname}?mock-import-count=${nextCount()}`);
};

const mockImport = ({resolve}) => (name, data) => {
    const [, pathname = name] = tryCatch(resolve, name);
    cache.set(pathname, data);
};

const reImport = ({resolve}) => async (name) => {
    const pathname = resolve(name);
    reImports.add(pathname);
    
    return await import(`${pathname}?mock-import-count=${nextCount()}`);
};

const reImportDefault = ({resolve}) => async (name) => {
    const imported = await reImport({resolve})(name);
    return imported.default;
};

const stop = ({resolve}) => (name) => {
    const pathname = resolve(name);
    cache.delete(pathname);
};

const stopAll = () => {
    cache.clear();
    reImports.clear();
    traceCache.clear();
};

