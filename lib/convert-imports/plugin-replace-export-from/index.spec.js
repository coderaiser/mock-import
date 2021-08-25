import initTest from '@putout/test';

import replaceImports from './index.js';

const {url} = import.meta;
const {pathname} = new URL('.', url);

const test = initTest(pathname, {
    'replace-imports': replaceImports,
});

test('mock-import: plugin: convert-export-from: no report: empty cache', (t) => {
    const cache = new Map();
    
    t.noReportWithOptions('export-local-from', {
        cache,
    });
    t.end();
});

test('mock-import: plugin: convert-export-from: report', (t) => {
    const cache = new Map();
    cache.set('y', 'xxx');
    
    t.reportWithOptions('export-local-from', '', {
        cache,
    });
    
    t.end();
});

test('mock-import: plugin: convert-export-from: transform: exists', (t) => {
    const cache = new Map();
    cache.set('y', 'xxx');
    
    t.transformWithOptions('export-local-from-exists', {
        cache,
    });
    
    t.end();
});

test('mock-import: plugin: convert-export-from: transform: export-local-from', (t) => {
    const cache = new Map();
    cache.set('y', 'xxx');
    
    t.transformWithOptions('export-local-from', {
        cache,
    });
    
    t.end();
});

test('mock-import: plugin: convert-export-from: transform: export-from', (t) => {
    const cache = new Map();
    cache.set('y', 'xxx');
    
    t.transformWithOptions('export-from', {
        cache,
    });
    
    t.end();
});

