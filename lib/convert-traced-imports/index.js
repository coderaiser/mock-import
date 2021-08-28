import putout from 'putout';
import convertToAbsolutePlugin from './plugin-convert-to-absolute/index.js';

const isInCache = (cache, resolve) => ({value}) => {
    const resolved = resolve(value);
    return [cache.has(resolved), resolved];
};

export default function convertTracedImports({source, traceCache, resolve, nextCount}) {
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

