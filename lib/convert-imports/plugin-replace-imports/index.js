import {types} from 'putout';
import {isInCache} from '../is-in-cache.js';

const {isImportSpecifier} = types;

export const report = () => '';

export const match = ({options}) => {
    const {cache} = options;
    
    return {
        'import __imports from "__b"': isInCache(cache),
    };
};

export const replace = () => ({
    'import __imports from "__a"'({__a, __imports}) {
        const {value} = __a;
        
        const init = `global.__mockImportCache.get('${value}');`;
        const vars = [];
        
        for (const specifier of __imports) {
            const {local, imported} = specifier;
            
            if (isImportSpecifier(specifier)) {
                vars.push(`${imported.name}: ${local.name}`);
                continue;
            }
            
            return `const ${local.name} = ${init}`;
        }
        
        return `const {${vars.join(',')}} = ${init}`;
    },
});

export default {
    report,
    match,
    replace,
};

