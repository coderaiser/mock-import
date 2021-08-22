import initTest from '@putout/test';

import replaceImports from './index.js';

const {url} = import.meta;
const {pathname} = new URL('.', url);

const test = initTest(pathname, {
    'replace-imports': replaceImports,
});

test('mock-import: plugin: replace imports: no report: empty cache', (t) => {
    const cache = new Map();
    
    t.noReportWithOptions('import', {
        cache,
    });
    t.end();
});

test('mock-import: plugin: replace imports: report', (t) => {
    const cache = new Map();
    cache.set('glob', 'xxx');
    
    t.reportWithOptions('import', '', {
        cache,
    });
    t.end();
});

test('mock-import: plugin: replace imports: transform', (t) => {
    const cache = new Map();
    cache.set('glob', {});
    
    t.transformWithOptions('import', {
        cache,
    });
    t.end();
});

test('mock-import: plugin: replace imports: transform: specifier', (t) => {
    const cache = new Map();
    cache.set('fs/promises', {});
    
    t.transformWithOptions('specifier', {
        cache,
    });
    t.end();
});

