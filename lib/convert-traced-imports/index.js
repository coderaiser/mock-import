import putout from 'putout';
import convertToAbsolutePlugin from './plugin-convert-to-absolute/index.js';
import {isInCache} from './../is-in-cache.js';

export function convertTracedImports({source, traceCache, resolve, nextCount}) {
    const isTraced = isInCache(traceCache, resolve);
    const {code} = putout(source, {
        rules: {
            'convert-to-absolute': ['on', {
                isTraced,
                nextCount,
            }],
        },
        plugins: [
            ['convert-to-absolute', convertToAbsolutePlugin],
        ],
    });
    
    return code;
}
