import {
    generate,
    transform,
} from 'putout';
import babel from '@putout/engine-parser/babel';

import {transformFromAstSync} from '@babel/core';
import babelPluginIstanbul from 'babel-plugin-istanbul';

import {isInCache} from '../is-in-cache.js';

import replaceImports from './plugin-replace-imports/index.js';
import replaceExportFrom from './plugin-replace-export-from/index.js';
import convertToAbsolute from './plugin-convert-to-absolute/index.js';
import dynamicImports from './plugin-dynamic-imports/index.js';
import convertImportToReImport from './plugin-convert-import-to-re-import/index.js';

export const convertImports = ({resolve, source, cache, nested, sourceFilename = '[mock-import]'}) => {
    const isMocked = isInCache(cache, resolve);
    
    const ast = babel.parse(source, {
        sourceFilename,
    });
    
    transform(ast, source, {
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
    
    const {code, map} = generate(ast, {sourceMaps: true}, {
        [sourceFilename]: source,
    });
    
    const result = instrument(ast, code, map, sourceFilename);
    
    return result.code + '\n';
};

function maybeConvertToReImport({isMocked, nested}) {
    if (!nested)
        return 'off';
    
    return ['on', {
        isMocked,
    }];
}

function instrument(ast, sourceCode, inputSourceMap, filename) {
    return transformFromAstSync(ast, sourceCode, {
        filename,
        cloneInputAst: false,
        plugins: [
            [babelPluginIstanbul, {
                inputSourceMap,
            }],
        ],
    });
}

