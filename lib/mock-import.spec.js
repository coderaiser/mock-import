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
    stop,
    stopAll,
} = createMockImport(import.meta.url);

test('mock-import: mockImport: reImportDefault', async (t) => {
    mockImport('glob', 'hello');
    const result = await reImportDefault('./fixture/import');
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
    
    t.match(result.source, /global.__mockImportCache.get/);
    t.end();
});

