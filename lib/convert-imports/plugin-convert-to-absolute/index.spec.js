import {createTest} from '@putout/test';
import stub from '@cloudcmd/stub';
import * as convert from './index.js';

const test = createTest(import.meta.url, {
    plugins: [
        ['convert-to-absolute', convert],
    ],
});

test('mock-import: plugin: convert to absolute: no report: empty cache', (t) => {
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

test('mock-import: plugin: convert to absolute: transform: internal', (t) => {
    const isMocked = stub().returns([true, '/glob.js']);
    
    t.transformWithOptions('import', {
        isMocked,
    });
    t.end();
});
