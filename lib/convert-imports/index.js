import putout from 'putout';

import replaceImportsPlugin from './replace-imports-plugin/index.js';
import convertToAbsolutePlugin from './convert-to-absolute-plugin/index.js';

export default async function convertImports({resolve, source, cache}) {
    const {code} = putout(source, {
        rules: {
            'replace-imports': ['on', {
                cache,
            }],
            'convert-imports': ['on', {
                resolve,
                cache,
            }],
        },
        plugins: [
            ['replace-imports', replaceImportsPlugin],
            ['convert-imports', convertToAbsolutePlugin],
        ],
    });
    
    return code;
}

