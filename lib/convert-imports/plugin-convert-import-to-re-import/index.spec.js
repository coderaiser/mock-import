import initTest from '@putout/test';
import {stub} from 'supertape';

import replaceImports from './index.js';

const {url} = import.meta;
const {pathname} = new URL('.', url);

const test = initTest(pathname, {
    'replace-imports': replaceImports,
});

test('mock-import: plugin: convert-import-to-re-import: no report', (t) => {
    const isMocked = stub().returns(true);
    
    t.noReportWithOptions('import', {
        isMocked,
    });
    t.end();
});

test('mock-import: plugin: convert-import-to-re-import: report', (t) => {
    const isMocked = stub().returns(false);
    
    t.reportWithOptions('import', '', {
        isMocked,
    });
    t.end();
});

test('mock-import: plugin: convert-import-to-re-import: transform', (t) => {
    const isMocked = stub().returns(false);
    
    t.transformWithOptions('import', {
        isMocked,
    });
    t.end();
});

test('mock-import: plugin: convert-import-to-re-import: transform: default-and-named', (t) => {
    const isMocked = stub().returns(false);
    
    t.transformWithOptions('default-and-named', {
        isMocked,
    });
    t.end();
});

test('mock-import: plugin: convert-import-to-re-import: transform: specifier', (t) => {
    const isMocked = stub().returns(false);
    
    t.transformWithOptions('specifier', {
        isMocked,
    });
    t.end();
});

test('mock-import: plugin: convert-import-to-re-import: transform: dynamic', (t) => {
    const isMocked = stub().returns(false);
    
    t.transformWithOptions('dynamic', {
        isMocked,
        resolve: stub().returns('./world'),
    });
    t.end();
});

test('mock-import: plugin: convert-import-to-re-import: transform: namespace', (t) => {
    const isMocked = stub().returns(false);
    
    t.transformWithOptions('namespace', {
        isMocked,
        resolve: stub().returns('./world'),
    });
    t.end();
});

