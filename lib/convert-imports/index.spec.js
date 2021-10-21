import {readFile} from 'fs/promises';

import test from 'supertape';
import stub from '@cloudcmd/stub';

import convertImports from './index.js';

const {url} = import.meta;

test('mock-imports: convert imports', async (t) => {
    const from = new URL('./fixture/import.js', url);
    const to = new URL('./fixture/import-fix.js', url);
    
    const source = await readFile(from, 'utf8');
    const expected = await readFile(to, 'utf8');
    
    const resolve = stub().returns('/glob.js');
    const cache = new Map();
    const traceCache = new Map();
    
    cache.set('/glob.js', {});
    
    const result = await convertImports({
        resolve,
        source,
        cache,
        traceCache,
    });
    
    t.equal(result, expected);
    t.end();
});

test('mock-imports: convert imports: bin', async (t) => {
    const from = new URL('./fixture/bin.js', url);
    const to = new URL('./fixture/bin-fix.js', url);
    
    const source = await readFile(from, 'utf8');
    const expected = await readFile(to, 'utf8');
    
    const resolve = stub().returns('/glob.js');
    const cache = new Map();
    const traceCache = new Map();
    
    cache.set('/glob.js', {});
    
    const result = await convertImports({
        resolve,
        source,
        cache,
        traceCache,
    });
    
    t.equal(result, expected);
    t.end();
});

test('mock-imports: convert imports: namespace', async (t) => {
    const from = new URL('./fixture/namespace.js', url);
    const to = new URL('./fixture/namespace-fix.js', url);
    
    const source = await readFile(from, 'utf8');
    const expected = await readFile(to, 'utf8');
    
    const resolve = stub().returns('/glob.js');
    const cache = new Map();
    const traceCache = new Map();
    
    cache.set('/glob.js', {});
    
    const result = await convertImports({
        resolve,
        source,
        cache,
        traceCache,
    });
    
    t.equal(result, expected);
    t.end();
});

test('mock-imports: convert imports: export-from', async (t) => {
    const from = new URL('./fixture/export-from.js', url);
    const to = new URL('./fixture/export-from-fix.js', url);
    
    const source = await readFile(from, 'utf8');
    const expected = await readFile(to, 'utf8');
    
    const resolve = stub().returns('/fs.js');
    const cache = new Map();
    
    cache.set('/fs.js', {});
    
    const result = await convertImports({
        resolve,
        source,
        cache,
    });
    
    t.equal(result, expected);
    t.end();
});

test('mock-imports: convert imports: dynamic', async (t) => {
    const from = new URL('./fixture/dynamic.js', url);
    const to = new URL('./fixture/dynamic-fix.js', url);
    
    const source = await readFile(from, 'utf8');
    const expected = await readFile(to, 'utf8');
    
    const resolve = stub().returns('../glob.js');
    const cache = new Map();
    
    cache.set('../glob.js', {});
    
    const result = await convertImports({
        resolve,
        source,
        cache,
    });
    
    t.equal(result, expected);
    t.end();
});

