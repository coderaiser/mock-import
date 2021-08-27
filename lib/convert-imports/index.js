import putout from 'putout';

import replaceImports from './plugin-replace-imports/index.js';
import replaceExportFrom from './plugin-replace-export-from/index.js';
import convertToAbsolute from './plugin-convert-to-absolute/index.js';
import dynamicImports from './plugin-dynamic-imports/index.js';

const isInCache = (cache, resolve) => ({__a, __b, value}) => {
    const name = (__b || __a)?.value || value;
    const resolved = resolve(name);
    
    return cache.has(resolved);
};

export default function convertImports({resolve, source, cache}) {
    const isMocked = isInCache(cache, resolve);
    
    const {code} = putout(source, {
        rules: {
            'dynamic-imports': ['on', {
                resolve,
                isMocked,
            }],
            'replace-imports': ['on', {
                isMocked,
            }],
            'replace-export-from': ['on', {
                isMocked,
            }],
            'convert-to-absolute': ['on', {
                resolve,
                isMocked,
            }],
        },
        plugins: [
            'remove-nested-blocks',
            ['convert-to-absolute', convertToAbsolute],
            ['dynamic-imports', dynamicImports],
            ['replace-imports', replaceImports],
            ['replace-export-from', replaceExportFrom],
        ],
    });
    
    return code;
}

