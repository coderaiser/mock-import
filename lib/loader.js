const LOADER = 'mock-import';

export function initialize({port}) {
    const cache = globalThis.__mockImportCache;
    const reImports = globalThis.__mockImportReImports;
    const traceCache = globalThis.__traceImportCache;
    
    port.onmessage = ({data}) => {
        const {loader, type} = data;
        
        if (loader !== LOADER)
            return;
        
        if (type === 'add-reimport') {
            const {pathname} = data;
            reImports.add(pathname);
            
            return;
        }
        
        if (type === 'set-cache') {
            const {name} = data;
            !cache.has(name) && cache.set(name);
            
            return;
        }
        
        if (type === 'set-trace-cache') {
            const {name, stack} = data;
            cache.set(name, stack);
            
            return;
        }
        
        if (type === 'stop-cache') {
            const {name} = data;
            cache.set(name, '[no stubs for loader]');
            
            return;
        }
        
        if (type === 'stop-all') {
            cache.clear();
            reImports.clear();
            traceCache.clear();
            
            return;
        }
        
        if (type === 'enable-nested-imports') {
            globalThis.__mockImportNested = true;
            return;
        }
        
        if (type === 'disable -nested-imports') {
            globalThis.__mockImportNested = false;
            return;
        }
    };
}
