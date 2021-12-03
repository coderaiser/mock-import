import {readFile} from 'fs/promises';

import {
    test,
    stub,
} from 'supertape';
import tryToCatch from 'try-to-catch';

import {
    createMockImport,
    transformSource,
    load,
} from './mock-import.js';
const {
    mockImport,
    reImport,
    reImportDefault,
    traceImport,
    reTrace,
    stop,
    stopAll,
} = createMockImport(import.meta.url);

test('mock-import: mockImport: default transform', async (t) => {
    const result = await reImportDefault('./fixture/import.js');
    
    t.equal(typeof result, 'function');
    t.end();
});

test('mock-import: mockImport: reImportDefault', async (t) => {
    mockImport('glob', 'hello');
    
    const result = await reImportDefault('./fixture/import');
    stopAll();
    
    t.equal(result, 'hello');
    t.end();
});

test('mock-import: mock-import-count', async (t) => {
    const result = await reImportDefault('./fixture/mock-import-count');
    
    t.match(result, /mock-import-count.js\?mock-import-count=\d$/);
    t.end();
});

test('mock-import: mockImport: reImportDefault: cannot resolve', async (t) => {
    mockImport('abc', 'hello');
    const [error] = await tryToCatch(reImport, './fixture/cannot-resolve');
    
    stopAll();
    
    t.match(error.message, `Cannot find module 'abc'`);
    t.end();
});

test('mock-import: mockImport: reImport', async (t) => {
    mockImport('glob', 'hello');
    
    const result = await reImport('./fixture/import');
    stop('glob');
    
    stopAll();
    
    t.equal(result.default, 'hello');
    t.end();
});

test('mock-import: mockImport: reImport: dynamic', async (t) => {
    mockImport('glob', {
        hello: 'world',
    });
    
    const {hello} = await reImport('./fixture/dynamic');
    stopAll();
    
    t.equal(hello, 'world');
    t.end();
});

test('mock-import: mockImport: reImport: default and named', async (t) => {
    mockImport('supertape', {
        stub: 'world',
    });
    
    const {stub} = await reImport('./fixture/default-and-named');
    stopAll();
    
    t.equal(stub, 'world');
    t.end();
});

test('mock-import: mockImport: transformSource: buffer', async (t) => {
    const name = './fixture/import.js';
    const url = new URL(name, import.meta.url);
    const {pathname} = url;
    
    const source = await readFile(url);
    const context = {
        type: 'module',
        url,
    };
    
    const defaultTransformSource = stub();
    
    mockImport('glob', 'hello');
    global.__mockImportReImports.add(pathname);
    
    const result = await transformSource(source, context, defaultTransformSource);
    stop('glob');
    
    stopAll();
    
    t.match(result.source, 'global.__mockImportCache.get');
    t.end();
});

test('mock-import: mockImport: transformSource: no change', async (t) => {
    const name = './fixture/import.js';
    const url = new URL(name, import.meta.url);
    
    const source = await readFile(url);
    const context = {
        type: 'module',
        url,
    };
    
    const defaultTransformSource = stub().returns('no change');
    
    const result = await transformSource(source, context, defaultTransformSource);
    
    t.equal(result, 'no change');
    t.end();
});

test('mock-import: mockImport: load', async (t) => {
    const name = './fixture/import.js';
    const url = new URL(name, import.meta.url);
    const {pathname} = url;
    
    const context = {
        type: 'module',
        url,
    };
    
    const defaultLoad = stub();
    
    mockImport('glob', 'hello');
    global.__mockImportReImports.add(pathname);
    
    const result = await load(url, context, defaultLoad);
    stop('glob');
    
    stopAll();
    
    t.match(result.source, 'global.__mockImportCache.get');
    t.end();
});

test('mock-import: mockImport: load: no change', async (t) => {
    const name = './fixture/import.js';
    const url = new URL(name, import.meta.url);
    
    const context = {
        type: 'module',
        url,
    };
    
    const defaultLoad = stub().returns('no change');
    const result = await load(url, context, defaultLoad);
    
    t.equal(result, 'no change');
    t.end();
});

test('mock-import: mockImport: load: cannot resolve', async (t) => {
    const name = './fixture/import.js';
    const url = new URL(name, import.meta.url);
    
    const context = {
        type: 'module',
        url,
    };
    
    const defaultLoad = stub().returns('no change');
    const result = await load('node:fs/promises', context, defaultLoad);
    
    t.equal(result, 'no change');
    t.end();
});

test('mock-import: mockImport: transformSource: traceImport', async (t) => {
    const input = './fixture/trace.js';
    const output = './fixture/trace-fix.js';
    const inputUrl = new URL(input, import.meta.url);
    const outputUrl = new URL(output, import.meta.url);
    const {pathname} = inputUrl;
    
    const source = await readFile(inputUrl, 'utf8');
    const expected = await readFile(outputUrl, 'utf8');
    
    const context = {
        type: 'module',
        url: inputUrl,
    };
    
    const defaultTransformSource = stub();
    const stack = [];
    
    global.__traceImportCache.set(pathname, stack);
    
    const result = await transformSource(source, context, defaultTransformSource);
    
    stopAll();
    
    t.equal(result.source, expected);
    t.end();
});

test('mock-import: mockImport: transformSource: traceImport: stack', async (t) => {
    const input = './fixture/trace.js';
    
    const stack = [];
    traceImport(input, {
        stack,
    });
    
    const {fn} = await reTrace(input);
    fn();
    
    stopAll();
    
    const expected = [
        ['fn', 'trace.js:1', []],
    ];
    
    t.deepEqual(stack, expected);
    t.end();
});

test('mock-import: mockImport: transformSource: traceImport: reImport', async (t) => {
    const input = './fixture/trace.js';
    const stack = [];
    
    traceImport(input, {
        stack,
    });
    
    await reTrace('./fixture/fresh-trace.js');
    
    stopAll();
    
    const expected = [
        ['fn', 'trace.js:1', []],
    ];
    
    t.deepEqual(stack, expected);
    t.end();
});

test('mock-import: mockImport: transformSource: traceImport: reImport: again the same trace', async (t) => {
    const input = './fixture/trace.js';
    const stack = [];
    
    traceImport(input, {
        stack,
    });
    
    await reTrace('./fixture/fresh-trace.js');
    
    stopAll();
    
    traceImport(input, {
        stack,
    });
    
    await reTrace('./fixture/fresh-trace.js');
    
    stopAll();
    
    const expected = [
        ['fn', 'trace.js:1', []],
        ['fn', 'trace.js:1', []],
    ];
    
    t.deepEqual(stack, expected);
    t.end();
});

test('mock-import: mockImport: transformSource: traceImport: reImport: nested', async (t) => {
    const inputParser = './fixture/nested-trace/parser.js';
    const inputTokenizer = './fixture/nested-trace/tokenizer.js';
    
    const stack = [];
    
    traceImport(inputParser, {
        stack,
    });
    
    traceImport(inputTokenizer, {
        stack,
    });
    
    await reTrace('./fixture/nested-trace/index.js');
    
    stopAll();
    
    const expected = [
        ['parse', 'parser.js:3', ['const a = 5']],
        ['tokenize', 'tokenizer.js:1', ['parser call', 'const a = 5']],
    ];
    
    t.deepEqual(stack, expected);
    t.end();
});

test('mockImport: nested reImport', async (t) => {
    mockImport('./fixture/nested-import/tokenizer.js', {
        tokenize: stub().returns('world'),
    });
    
    const {hello} = await reImport('./fixture/nested-import/index.js');
    
    stopAll();
    
    const expected = 'world';
    
    t.deepEqual(hello, expected);
    t.end();
});
