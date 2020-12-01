import {types} from 'putout';
const {
    isImportSpecifier,
    isImportDefaultSpecifier,
} = types;

export const report = () => '';

export const match = ({options}) => ({
    'import __imports from "__a"'({__a}) {
        const {cache} = options;
        const {value} = __a;
        
        return cache.has(value);
    },
});

export const replace = () => ({
    'import __imports from "__a"'({__a, __imports}) {
        const {value} = __a;
        
        const init = `global.__mockImportCache.get('${value}');`;
        const vars = [];
        
        for (const specifier of __imports) {
            const {local, imported} = specifier;
            
            if (isImportDefaultSpecifier(specifier))
                return `const ${local.name} = ${init}`;
            
            if (isImportSpecifier(specifier)) {
                vars.push(`${imported.name}: ${local.name}`);
                continue;
            }
        }
        
        return `const {${vars.join(',')}} = ${init}`;
    },
});

export default {
    report,
    match,
    replace,
};

