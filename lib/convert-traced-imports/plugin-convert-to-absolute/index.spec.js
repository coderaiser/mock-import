import initTest from '@putout/test';
import stub from '@cloudcmd/stub';
import convert from './index.js';

const {url} = import.meta;
const {pathname} = new URL('.', url);

const test = initTest(pathname, {
    'convert-to-absolute': convert,
});

test('mock-import: convert-traced-imports: convert to absolute: no report: empty cache', (t) => {
    let i = 0;
    const nextCount = () => ++i;
    const isTraced = stub().returns([false, '']);
    
    t.noReportWithOptions('import-no-report', {
        nextCount,
        isTraced,
    });
    t.end();
});

test('mock-import: convert-traced-imports: convert to absolute: report', (t) => {
    const isTraced = stub().returns([true, './glob.js']);
    let i = 0;
    const nextCount = () => ++i;
    
    t.reportWithOptions('import', '', {
        isTraced,
        nextCount,
    });
    t.end();
});

test('mock-import: convert-traced-imports: plugin: convert to absolute: transform: internal', (t) => {
    const isTraced = stub().returns([true, './glob.js']);
    let i = 0;
    const nextCount = () => ++i;
    
    t.transformWithOptions('import', {
        isTraced,
        nextCount,
    });
    t.end();
});
