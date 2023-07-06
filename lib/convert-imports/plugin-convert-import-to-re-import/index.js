import {replaceImport} from '../replace-import.js';

const not = (fn) => (...a) => !fn(...a);

export const report = () => '';

export const match = ({options}) => {
    const {isMocked} = options;
    const notMocked = not(isMocked);
    
    return {
        'import __imports from "__b"': notMocked,
        'import("__b")': notMocked,
    };
};

export const replace = ({options}) => ({
    'import __imports from "__a"': replaceImport(`await global.__reImport('__a', import.meta.url)`, (importDefault) => {
        return `(${importDefault}).default`;
    }),
    'import("__a")'({__a}) {
        const {value} = __a;
        const {resolve} = options;
        
        return `global.__reImport('${resolve(value)}', import.meta.url);`;
    },
});

export default {
    report,
    match,
    replace,
};
