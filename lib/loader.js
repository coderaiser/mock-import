const LOADER = 'mock-import';

export function initialize({port}) {
    const cache = global.__mockImportCache;
    const reImports = global.__mockImportReImports;
    const traceCache = global.__traceImportCache;
    
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
            global.__mockImportNested = true;
            return;
        }
        
        if (type === 'disable -nested-imports') {
            global.__mockImportNested = false;
            return;
        }
    };
}
