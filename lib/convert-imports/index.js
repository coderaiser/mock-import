import putout from 'putout';

import replaceImportsPlugin from './replace-imports-plugin/index.js';
import convertToAbsolutePlugin from './convert-to-absolute-plugin/index.js';

export default async function convertImports({resolve, source, cache}) {
    const convertedCode = convertImportsToAbsolute(source, {
        cache,
        resolve,
    });
    
    const replacedCode = replaceImportsWithMock(convertedCode, {
        cache,
    });
    
    return replacedCode;
}

function convertImportsToAbsolute(source, {cache, resolve}) {
    const {code} = putout(source, {
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
    
    return code;
}

function replaceImportsWithMock(source, {cache}) {
    const {code} = putout(source, {
        rules: {
            'replace-imports': ['on', {
                cache,
            }],
        },
        plugins: [
            ['replace-imports', replaceImportsPlugin],
        ],
    });
    
    return code;
}

