import initTest from '@putout/test';
import stub from '@cloudcmd/stub';

import convert from './index.js';

const {url} = import.meta;
const {pathname} = new URL('.', url);

const test = initTest(pathname, {
    'convert-to-absolute': convert,
});

test('mock-import: plugin: convert to absolute: no report: empty cache', (t) => {
    const cache = new Map();
    const resolve = stub();
    
    t.noReportWithOptions('import', {
        cache,
        resolve,
    });
    t.end();
});

test('mock-import: plugin: convert to absolute: report', (t) => {
    const resolve = stub().returns('/glob.js');
    const cache = new Map();
    
    cache.set('/glob.js', 'xxx');
    
    t.reportWithOptions('import', '', {
        cache,
        resolve,
    });
    t.end();
});

test('mock-import: plugin: convert to absolute: transform: internal', (t) => {
    const resolve = stub().returns('/glob.js');
    const cache = new Map();
    cache.set('/glob.js', {});
    
    t.transformWithOptions('import', {
        cache,
        resolve,
    });
    t.end();
});

