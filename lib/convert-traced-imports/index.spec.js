import {join} from 'path';
import {readFile} from 'fs/promises';
import {test} from 'supertape';
import {createCommons} from 'simport';
import convertTracedImport from './index.js';

const {url} = import.meta;
const {__dirname} = createCommons(url);

test('mock-import: convert-traced-imports', async (t) => {
    const stack = [];
    const input = new URL('./fixture/index.js', url);
    const source = await readFile(input, 'utf8');
    const traced = join(__dirname, '/hello.js');
    
    const i = 0;
    const resolve = () => traced;
    const nextCount = () => i;
    const traceCache = new Map();
    
    traceCache.set(traced, {stack});
    
    const result = convertTracedImport({
        source,
        resolve,
        traceCache,
        nextCount,
    });
    
    t.match(result, 'hello.js\\?count=0');
    t.end();
});

