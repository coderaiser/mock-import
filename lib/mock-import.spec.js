import test from 'supertape';

import {createMockImport} from './mock-import.js';
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

