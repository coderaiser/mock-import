export const report = () => '';

export const match = ({options}) => ({
    'import("__a")': ({__a}) => {
        const {isMocked} = options;
        
        return isMocked(__a.value);
    },
});

export const replace = ({options}) => ({
    'import("__a")'({__a}) {
        const {value} = __a;
        const {resolve} = options;
        
        return `global.__mockImportCache.get('${resolve(value)}');`;
    },
});

export default {
    report,
    replace,
    match,
};

