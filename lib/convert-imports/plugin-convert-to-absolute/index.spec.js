import {createTest} from '@putout/test';
import {stub} from 'supertape';
import * as convert from './index.js';

const test = createTest(import.meta.url, {
    plugins: [
        ['convert-to-absolute', convert],
    ],
});

test('mock-import: plugin: convert to absolute: no report with options: import-no-report', (t) => {
    const isMocked = stub().returns([false, '']);
    
    t.noReportWithOptions('import-no-report', {
        isMocked,
    });
    t.end();
});

test('mock-import: plugin: convert to absolute: report', (t) => {
    const isMocked = stub().returns([true, '/glob.js']);
    
    t.reportWithOptions('import', '', {
        isMocked,
    });
    t.end();
});

test('mock-import: plugin: convert to absolute: transform with options: import', (t) => {
    const isMocked = stub().returns([true, '/glob.js']);
    
    t.transformWithOptions('import', {
        isMocked,
    });
    t.end();
});
