import initTest from '@putout/test';
import {stub} from 'supertape';

import replaceImports from './index.js';

const {url} = import.meta;
const {pathname} = new URL('.', url);

const test = initTest(pathname, {
    'replace-imports': replaceImports,
});

test('mock-import: plugin: replace imports: no report: empty cache', (t) => {
    const isMocked = stub();
    
    t.noReportWithOptions('import', {
        isMocked,
    });
    t.end();
});

test('mock-import: plugin: replace imports: report', (t) => {
    const isMocked = stub().returns(true);
    
    t.reportWithOptions('import', '', {
        isMocked,
    });
    t.end();
});

test('mock-import: plugin: replace imports: transform', (t) => {
    const isMocked = stub().returns(true);
    
    t.transformWithOptions('import', {
        isMocked,
    });
    t.end();
});

test('mock-import: plugin: replace imports: transform: default-and-named', (t) => {
    const isMocked = stub().returns(true);
    
    t.transformWithOptions('default-and-named', {
        isMocked,
    });
    t.end();
});

test('mock-import: plugin: replace imports: transform: specifier', (t) => {
    const isMocked = stub().returns(true);
    
    t.transformWithOptions('specifier', {
        isMocked,
    });
    t.end();
});

