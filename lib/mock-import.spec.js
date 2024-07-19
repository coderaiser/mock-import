import {readFile} from 'node:fs/promises';
import process from 'node:process';
import {test, stub} from 'supertape';
import tryToCatch from 'try-to-catch';
import {
    createMockImport,
    load,
    enableNestedImports,
    disableNestedImports,
} from './mock-import.js';

const {
    mockImport,
    reImport,
    reImportDefault,
    traceImport,
    reTrace,
    stopAll,
} = createMockImport(import.meta.url);

const checkVersion = () => /20/.test(process.version);

test('mock-import: mockImport: default transform', async (t) => {
    const result = await reImportDefault('./fixture/import.js');
    
    t.equal(typeof result, 'function');
    t.end();
});

test('mock-import: mockImport: reImportDefault', async (t) => {
    mockImport('try-catch', 'hello');
    
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
    
    t.match(error.message, 'Cannot find');
    t.end();
});

test('mock-import: mockImport: reImport', async (t) => {
    mockImport('try-catch', 'hello');
    
    const result = await reImport('./fixture/import');
    
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

test('mock-import: mockImport: load', async (t) => {
    const name = './fixture/import.js';
    const url = new URL(name, import.meta.url);
    const {pathname} = url;
    
    const context = {
        format: 'module',
    };
    
    const defaultLoad = stub().resolves({
        format: 'module',
        source: await readFile(new URL(name, import.meta.url).pathname, 'utf8'),
    });
    
    mockImport('try-catch', 'hello');
    global.__mockImportReImports.add(pathname);
    
    const result = await load(url.href, context, defaultLoad);
    
    stopAll();
    
    t.match(result.source, 'global.__mockImportCache.get');
    t.end();
});

test('mock-import: mockImport: load: defaultLoad: source passed', async (t) => {
    const name = './fixture/import.js';
    const url = new URL(name, import.meta.url);
    
    const context = {};
    
    const source = 'const hello = "world"';
    const defaultLoad = stub().resolves({
        format: 'module',
        source,
    });
    
    const result = await load(url.href, context, defaultLoad);
    
    t.equal(result.source, source);
    t.end();
});

test('mock-import: mockImport: load: no change', async (t) => {
    const name = './fixture/import.js';
    const url = new URL(name, import.meta.url);
    
    const context = {};
    
    const defaultLoad = stub().resolves({
        source: 'no change',
    });
    
    const result = await load(url.href, context, defaultLoad);
    
    t.equal(result.source, 'no change');
    t.end();
});

test('mock-import: mockImport: load: commonjs', async (t) => {
    const defaultLoad = stub().resolves({
        format: 'commonjs',
    });
    
    const context = {};
    const result = await load('node:fs', context, defaultLoad);
    
    const expected = {
        format: 'commonjs',
    };
    
    t.deepEqual(result, expected);
    t.end();
});

test('mock-import: mockImport: load: cannot resolve', async (t) => {
    const name = './fixture/import.js';
    const url = new URL(name, import.meta.url);
    
    const context = {
        type: 'module',
        url,
    };
    
    const defaultLoad = stub().resolves({
        source: 'no change',
    });
    
    const result = await load('node:fs/promises', context, defaultLoad);
    
    t.equal(result.source, 'no change');
    t.end();
});

test('mock-import: mockImport: transformSource: traceImport: stack', async (t) => {
    if (checkVersion())
        return t.pass('skip on node v20');
    
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
    if (checkVersion())
        return t.pass('skip on node v20');
    
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
    if (checkVersion())
        return t.pass('skip on node v20');
    
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
    if (checkVersion())
        return t.pass('skip on node v20');
    
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
        ['parse', 'parser.js:3', [
            'const a = 5',
        ]],
        ['tokenize', 'tokenizer.js:1', [
            'parser call',
            'const a = 5',
        ]],
    ];
    
    t.deepEqual(stack, expected);
    t.end();
});

test('mock-import: reImport: native', async (t) => {
    const path = await reImport('path');
    const nativePath = await import('node:path');
    
    t.equal(path, nativePath);
    t.end();
});

test('mockImport: nested reImport', async (t) => {
    if (checkVersion())
        return t.pass('skip on node v20');
    
    const {__mockImportNested} = global;
    
    global.__mockImportNested = true;
    
    mockImport('./fixture/nested-import/tokenizer.js', {
        tokenize: stub().returns('world'),
    });
    
    const {hello} = await reImport('./fixture/nested-import/index.js');
    
    stopAll();
    global.__mockImportNested = __mockImportNested;
    
    const expected = 'world';
    
    t.equal(hello, expected);
    t.end();
});

test('mockImport: nested reImport: MOCK_IMPORT_NESTED', async (t) => {
    enableNestedImports();
    
    mockImport('./fixture/nested-import/tokenizer.js', {
        tokenize: stub().returns('world'),
    });
    
    const {hello} = await reImport('./fixture/nested-import/index.js');
    
    stopAll();
    disableNestedImports();
    
    const expected = 'world';
    
    t.equal(hello, expected);
    t.end();
});

test('mockImport: enableNestedImports', (t) => {
    enableNestedImports();
    
    t.ok(global.__mockImportNested);
    t.end();
});

test('mockImport: disableNestedImports', (t) => {
    disableNestedImports();
    
    t.notOk(global.__mockImportNested);
    t.end();
});
