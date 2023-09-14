import {readFile} from 'node:fs/promises';
import {test} from 'supertape';
import {traceImports} from './index.js';

const {url} = import.meta;

test('mock-import: trace-imports', async (t) => {
    const stack = [];
    const input = new URL('./fixture/trace.js', url);
    const output = new URL('./fixture/trace-fix.js', url);
    const source = await readFile(input, 'utf8');
    const expected = await readFile(output, 'utf8');
    
    const result = traceImports({
        source,
        stack,
        url: input,
    });
    
    t.equal(result, expected);
    t.end();
});
