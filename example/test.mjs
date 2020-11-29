import {createMockImport} from '../lib/mock-import.js';
const {
    mockImport,
    reImport,
    stopAll,
} = createMockImport(import.meta.url);

mockImport('./data.mjs', 'abc');
console.log((await reImport('./impl.mjs')).get());

mockImport('./data.mjs', 'cba');
console.log((await reImport('./impl.mjs')).get());

stopAll();
