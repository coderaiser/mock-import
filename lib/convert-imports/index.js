import {parse, transform, print} from 'putout';

import replaceImportsPlugin from './replace-imports-plugin/index.js';
import convertToAbsolutePlugin from './convert-to-absolute-plugin/index.js';

export default async function convertImports({resolve, source, cache}) {
    const ast = parse(source);
    
    convertImportsToAbsolute(ast, source, {
        cache,
        resolve,
    });
    
    replaceImportsWithMock(ast, source, {
        cache,
    });
    
    const printed = print(ast);
    
    return printed;
}

function convertImportsToAbsolute(ast, source, {cache, resolve}) {
    transform(ast, source, {
        rules: {
            'convert-imports': ['on', {
                resolve,
                cache,
            }],
        },
        plugins: [
            ['convert-imports', convertToAbsolutePlugin],
        ],
    });
}

function replaceImportsWithMock(ast, source, {cache}) {
    transform(ast, source, {
        rules: {
            'replace-imports': ['on', {
                cache,
            }],
        },
        plugins: [
            ['replace-imports', replaceImportsPlugin],
        ],
    });
}

