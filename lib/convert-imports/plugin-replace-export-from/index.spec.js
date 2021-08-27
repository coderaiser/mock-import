import initTest from '@putout/test';
import {stub} from 'supertape';

import replaceImports from './index.js';

const {url} = import.meta;
const {pathname} = new URL('.', url);

const test = initTest(pathname, {
    'replace-imports': replaceImports,
});

test('mock-import: plugin: convert-export-from: no report: empty cache', (t) => {
    const isMocked = stub();
    
    t.noReportWithOptions('export-local-from', {
        isMocked,
    });
    t.end();
});

test('mock-import: plugin: convert-export-from: report', (t) => {
    const isMocked = stub().returns(true);
    
    t.reportWithOptions('export-local-from', '', {
        isMocked,
    });
    
    t.end();
});

test('mock-import: plugin: convert-export-from: transform: exists', (t) => {
    const isMocked = stub().returns(true);
    
    t.transformWithOptions('export-local-from-exists', {
        isMocked,
    });
    
    t.end();
});

test('mock-import: plugin: convert-export-from: transform: export-local-from', (t) => {
    const isMocked = stub().returns(true);
    
    t.transformWithOptions('export-local-from', {
        isMocked,
    });
    
    t.end();
});

test('mock-import: plugin: convert-export-from: transform: export-from', (t) => {
    const isMocked = stub().returns(true);
    
    t.transformWithOptions('export-from', {
        isMocked,
    });
    
    t.end();
});

