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

export function transformSource(source, context, defaultTransformSource) {
    const {url} = context;
    const {pathname} = new URL(url);
    const {resolve} = createRequire(pathname);
    
    let code = source.toString();
    
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
    
    if (code !== String(source))
        return {
            source: code,
        };
    
    return defaultTransformSource(source, context, defaultTransformSource);
}

const traceImport = ({resolve}) => (name, {stack}) => {
    const [, pathname = name] = tryCatch(resolve, name);
    traceCache.set(pathname, stack);
};

const reTrace = ({resolve}) => async (name) => {
    const pathname = resolve(name);
    return await import(`${pathname}?count=${nextCount()}`);
};

const mockImport = ({resolve}) => (name, data) => {
    const [, pathname = name] = tryCatch(resolve, name);
    cache.set(pathname, data);
};

const reImport = ({resolve}) => async (name) => {
    const pathname = resolve(name);
    reImports.add(pathname);
    
    return await import(`${pathname}?count=${nextCount()}`);
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

