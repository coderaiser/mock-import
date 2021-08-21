import putout from 'putout';

import replaceImportsPlugin from './replace-imports-plugin/index.js';
import replaceExportFromPlugin from './replace-export-from/index.js';
import convertToAbsolutePlugin from './convert-to-absolute-plugin/index.js';

export default async function convertImports({resolve, source, cache}) {
    const {code} = putout(source, {
        rules: {
            'replace-imports': ['on', {
                cache,
            }],
            'replace-export-from': ['on', {
                cache,
            }],
            'convert-imports': ['on', {
                resolve,
                cache,
            }],
        },
        plugins: [
            'remove-nested-blocks',
            ['replace-imports', replaceImportsPlugin],
            ['replace-export-from', replaceExportFromPlugin],
            ['convert-imports', convertToAbsolutePlugin],
        ],
    });
    
    return code;
}

