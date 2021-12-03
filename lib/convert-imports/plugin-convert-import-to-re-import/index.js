import {replaceImport} from '../replace-import.js';

export const report = () => '';

export const match = ({options}) => ({
    'import __imports from "__b"': ({__a, __b}) => {
        const {isMocked} = options;
        const is = isMocked({
            __a,
            __b,
        });
        
        return !is;
    },
});

export const replace = () => ({
    'import __imports from "__a"': replaceImport(`await reImport('__a');`),
});

export default {
    report,
    match,
    replace,
};

