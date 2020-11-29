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
        
        const [first] = __imports;
        const id = `const ${first.local.name}`;
        const init = `global.__mockImportCache.get('${value}');`;
        
        return `${id} = ${init}`;
    },
});

export default {
    report,
    match,
    replace,
};

