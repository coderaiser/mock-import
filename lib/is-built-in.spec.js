import {test} from 'supertape';
import {isBuiltIn} from './is-built-in.js';

test('mock-import: is-built-in: process', (t) => {
    const result = isBuiltIn('process');
    
    t.ok(result);
    t.end();
});
