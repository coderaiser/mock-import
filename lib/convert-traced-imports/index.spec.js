import {readFile} from 'node:fs/promises';
import {test} from 'supertape';
import {convertTracedImports} from './index.js';

const {url} = import.meta;

test('mock-import: convert-traced-imports', async (t) => {
    const stack = [];
    const input = new URL('./fixture/import.js', url);
    const output = new URL('./fixture/import-fix.js', url);
    const source = await readFile(input, 'utf8');
    const expected = await readFile(output, 'utf8');
    
    const i = 0;
    const resolve = () => './hello.js';
    const nextCount = () => i;
    const traceCache = new Map();
    
    traceCache.set('./hello.js', {
        stack,
    });
    
    const result = convertTracedImports({
        source,
        resolve,
        traceCache,
        nextCount,
    });
    
    t.equal(result, expected);
    t.end();
});
