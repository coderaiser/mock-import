import putout from 'putout';

import replaceImports from './plugin-replace-imports/index.js';
import replaceExportFrom from './plugin-replace-export-from/index.js';
import convertToAbsolute from './plugin-convert-to-absolute/index.js';

export default async function convertImports({resolve, source, cache}) {
    const {code} = putout(source, {
        rules: {
            'replace-imports': ['on', {
                cache,
            }],
            'replace-export-from': ['on', {
                cache,
            }],
            'convert-to-absolute': ['on', {
                resolve,
                cache,
            }],
        },
        plugins: [
            'remove-nested-blocks',
            ['replace-imports', replaceImports],
            ['replace-export-from', replaceExportFrom],
            ['convert-to-absolute', convertToAbsolute],
        ],
    });
    
    return code;
}

