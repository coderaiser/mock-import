import putout from 'putout';
import {isInCache} from '../is-in-cache.js';
import replaceImports from './plugin-replace-imports/index.js';
import replaceExportFrom from './plugin-replace-export-from/index.js';
import convertToAbsolute from './plugin-convert-to-absolute/index.js';
import dynamicImports from './plugin-dynamic-imports/index.js';
import convertImportToReImport from './plugin-convert-import-to-re-import/index.js';

export const convertImports = ({resolve, source, cache, nested, sourceFileName}) => {
    const sourceMapName = sourceFileName && `${sourceFileName}.map`;
    
    const isMocked = isInCache(cache, resolve);
    const {code} = putout(source, {
        sourceFileName,
        sourceMapName,
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
            'convert-import-to-re-import': maybeConvertToReImport({
                isMocked,
                nested,
            }),
        },
        plugins: [
            'remove-nested-blocks',
            ['convert-to-absolute', convertToAbsolute],
            ['convert-import-to-re-import', convertImportToReImport],
            ['dynamic-imports', dynamicImports],
            ['replace-imports', replaceImports],
            ['replace-export-from', replaceExportFrom],
        ],
    });
    
    return code;
};

function maybeConvertToReImport({isMocked, nested}) {
    if (!nested)
        return 'off';
    
    return ['on', {
        isMocked,
    }];
}
