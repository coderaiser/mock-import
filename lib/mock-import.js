import {createRequire} from 'module';
import convertImports from './convert-imports/index.js';
import tryCatch from 'try-catch';

global.__mockImportCache = global.__mockImportCache || new Map();
global.__mockImportReImports = global.__mockImportReImports || new Set();
global.__mockImportCounter = global.__mockImportCounter || 0;

const cache = global.__mockImportCache;
const reImports = global.__mockImportReImports;
const nextCount = () => ++global.__mockImportCounter;

export const createMockImport = (url) => {
    const {resolve} = createRequire(url);
    
    return {
        mockImport: mockImport({resolve}),
        reImport: reImport({resolve}),
        reImportDefault: reImportDefault({resolve}),
        stop: stop({resolve}),
        stopAll,
    };
};

export async function transformSource(source, context, defaultTransformSource) {
    const {url} = context;
    const {pathname} = new URL(url);
    
    if (reImports.has(pathname)) {
        const {resolve} = createRequire(pathname);
        const code = await convertImports({
            resolve,
            source: source.toString(),
            cache,
        });
        
        return {
            source: code,
        };
    }
    
    return defaultTransformSource(source, context, defaultTransformSource);
}

const mockImport = ({resolve}) => (name, data) => {
    const [, pathname = name] = tryCatch(resolve, name);
    
    reImports.add(pathname);
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
};

