import {replaceImport} from '../replace-import.js';

export const report = () => '';

export const match = ({options}) => {
    const {isMocked} = options;
    
    return {
        'import __imports from "__b"': isMocked,
    };
};

export const replace = () => ({
    'import __imports from "__a"': replaceImport(`global.__mockImportCache.get('__a');`),
});

export default {
    report,
    match,
    replace,
};
