import {readFile} from 'fs/promises';

import test from 'supertape';
import stub from '@cloudcmd/stub';

import {
    createMockImport,
    transformSource,
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
    const result = await reImportDefault('./fixture/import');
    
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

test('mock-import: mockImport: reImportDefault: cannot resolve', async (t) => {
    mockImport('abc', 'hello');
    const result = await reImportDefault('./fixture/cannot-resolve');
    
    stopAll();
    
    t.equal(result, 'hello');
    t.end();
});

test('mock-import: mockImport: reImport', async (t) => {
    mockImport('glob', 'hello');
    const result = await reImport('./fixture/import');
    stop('glob');
    
    t.equal(result.default, 'hello');
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
    
    t.match(result.source, 'global.__mockImportCache.get');
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
    
    await reImport('./fixture/fresh-trace.js');
    
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
    
    await reImport('./fixture/fresh-trace.js');
    
    stopAll();
    
    traceImport(input, {
        stack,
    });
    
    await reImport('./fixture/fresh-trace.js');
    
    stopAll();
    const expected = [
        ['fn', 'trace.js:1', []],
        ['fn', 'trace.js:1', []],
    ];
    
    t.deepEqual(stack, expected);
    t.end();
});

