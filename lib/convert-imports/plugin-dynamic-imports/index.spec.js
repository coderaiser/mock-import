import initTest from '@putout/test';
import {stub} from 'supertape';
import replaceImports from './index.js';

const {url} = import.meta;
const {pathname} = new URL('.', url);

const test = initTest(pathname, {
    'replace-imports': replaceImports,
});

test('mock-import: plugin: dynamic-imports: no report: empty cache', (t) => {
    const resolve = stub();
    const isMocked = stub().returns(false);
    
    t.noReportWithOptions('import', {
        resolve,
        isMocked,
    });
    t.end();
});

test('mock-import: plugin: dynamic-imports: report', (t) => {
    const resolve = stub();
    const isMocked = stub().returns(true);
    
    t.reportWithOptions('import', '', {
        resolve,
        isMocked,
    });
    t.end();
});

test('mock-import: plugin: dynamic-imports: transform', (t) => {
    const resolve = stub().returns('../glob.js');
    const isMocked = stub().returns(true);
    
    t.transformWithOptions('import', {
        isMocked,
        resolve,
    });
    t.end();
});
