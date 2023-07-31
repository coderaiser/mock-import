export const report = () => '';

export const match = ({options}) => {
    const {isMocked} = options;
    
    return {
        'export * as __a from "__b"': isMocked,
        'export {__a} from "__b"': isMocked,
    };
};

export const replace = () => ({
    'export * as __a from "__b"': rebuildExport,
    'export {__a} from "__b"': rebuildExport,
});

function rebuildExport({__a, __b}, path) {
    const {name} = __a;
    const init = `global.__mockImportCache.get('${__b.value}')`;
    
    if (!path.scope.bindings[name])
        return `export const ${name} = ${init}`;
    
    const tmp = path.scope.generateUid();
    
    const id = getId({
        name,
        tmp,
        path,
    });
    
    return `{
        const ${id} = ${init};
        export {
            ${tmp} as ${name}
        }
    }`;
}

function getId({name, tmp, path}) {
    const specifier = path.get('specifiers.0');
    
    if (specifier.isExportNamespaceSpecifier())
        return tmp;
    
    return `{${name}:${tmp}}`;
}

export default {
    report,
    match,
    replace,
};
