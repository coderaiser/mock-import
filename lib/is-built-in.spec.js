import {test} from 'supertape';
import {isBuiltIn} from './is-built-in.js';

test('mock-import: is-built-in: process', (t) => {
    const result = isBuiltIn('process');
    
    t.ok(result);
    t.end();
});

test('mock-import: is-built-in: fs/promises', (t) => {
    const result = isBuiltIn('fs/promises');
    
    t.ok(result);
    t.end();
});
