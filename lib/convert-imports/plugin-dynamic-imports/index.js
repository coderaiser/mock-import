export const report = () => '';

export const match = ({options}) => {
    const {isMocked} = options;
    
    return {
        'import("__b")': isMocked,
    };
};

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
