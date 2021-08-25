import initTest from '@putout/test';
import stub from '@cloudcmd/stub';

import convert from './index.js';

const {url} = import.meta;
const {pathname} = new URL('.', url);

const test = initTest(pathname, {
    'convert-to-absolute': convert,
});

test('mock-import: trace-imports: plugins: convert to absolute: no report: empty cache', (t) => {
    const cache = new Map();
    const traceCache = new Map();
    const resolve = stub();
    let i = 0;
    const nextCount = () => ++i;
    
    t.noReportWithOptions('import', {
        cache,
        traceCache,
        resolve,
        nextCount,
    });
    t.end();
});

test('mock-import: trace-imports: plugins: convert to absolute: report', (t) => {
    const resolve = stub().returns('/glob.js');
    const cache = new Map();
    let i = 0;
    const nextCount = () => ++i;
    
    cache.set('/glob.js', 'xxx');
    
    t.reportWithOptions('import', '', {
        cache,
        resolve,
        nextCount,
    });
    t.end();
});

test('mock-import: trace-imports: plugins: convert to absolute: transform: internal', (t) => {
    const resolve = stub().returns('/glob.js');
    const cache = new Map();
    cache.set('/glob.js', {});
    let i = 0;
    const nextCount = () => ++i;
    
    t.transformWithOptions('import', {
        cache,
        resolve,
        nextCount,
    });
    t.end();
});

