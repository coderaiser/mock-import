import putout from 'putout';
import convertToAbsolutePlugin from './plugin-convert-to-absolute/index.js';

export default function convertTracedImports({source, traceCache, resolve, nextCount}) {
    const {code} = putout(source, {
        rules: {
            'convert-to-absolute': ['on', {
                traceCache,
                resolve,
                nextCount,
            }],
        },
        plugins: [
            ['convert-to-absolute', convertToAbsolutePlugin],
        ],
    });
    
    return code;
}

