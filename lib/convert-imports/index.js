import putout from 'putout';

import replaceImports from './plugin-replace-imports/index.js';
import replaceExportFrom from './plugin-replace-export-from/index.js';
import convertToAbsolute from './plugin-convert-to-absolute/index.js';
import dynamicImports from './plugin-dynamic-imports/index.js';

const isMocked = ({cache}) => (name) => {
    return cache.has(name);
};

export default function convertImports({resolve, source, cache, traceCache}) {
    const {code} = putout(source, {
        rules: {
            'dynamic-imports': ['on', {
                resolve,
                isMocked,
            }],
            'replace-imports': ['on', {
                cache,
                traceCache,
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
            ['dynamic-imports', dynamicImports],
            ['replace-imports', replaceImports],
            ['replace-export-from', replaceExportFrom],
            ['convert-to-absolute', convertToAbsolute],
        ],
    });
    
    return code;
}

