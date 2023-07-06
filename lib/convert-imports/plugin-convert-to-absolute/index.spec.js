import initTest from '@putout/test';
import stub from '@cloudcmd/stub';
import convert from './index.js';

const {url} = import.meta;
const {pathname} = new URL('.', url);

const test = initTest(pathname, {
    'convert-to-absolute': convert,
});

test('mock-import: plugin: convert to absolute: no report: empty cache', (t) => {
    const isMocked = stub().returns([false, '']);
    
    t.noReportWithOptions('import', {
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
