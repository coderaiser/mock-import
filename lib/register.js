import {register} from 'node:module';
import {MessageChannel} from 'node:worker_threads';

const {port1, port2} = new MessageChannel();

initialize({
    port: port1,
});

register('./mock-import.js', import.meta.url, {
    parentURL: import.meta.url,
    data: {
        port: port2,
    },
    transferList: [port2],
});

function initialize({port}) {
    const loader = 'mock-import';
    
    globalThis.__mockImportLoader = {
        addReImport(pathname) {
            port.postMessage({
                type: 'add-reimport',
                pathname,
                loader,
            });
        },
        enableNestedImports() {
            port.postMessage({
                type: 'enable-nested-imports',
                loader,
            });
        },
        disableNestedImports() {
            port.postMessage({
                type: 'disable-nested-imports',
                loader,
            });
        },
        stopCache(name) {
            port.postMessage({
                type: 'stop-cache',
                name,
                loader,
            });
        },
        setCache(name) {
            port.postMessage({
                type: 'set-cache',
                name,
                loader,
            });
        },
        setTraceCache(name, stack) {
            port.postMessage({
                type: 'set-trace-cache',
                name,
                stack,
                loader,
            });
        },
        stopAll() {
            port.postMessage({
                type: 'stop-all',
                loader,
            });
        },
    };
}
