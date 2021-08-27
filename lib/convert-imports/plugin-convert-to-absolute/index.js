export const report = () => '';

export const fix = ({path, resolved}) => {
    path.node.source.value = resolved;
};

export const traverse = ({push, options}) => ({
    ImportDeclaration(path) {
        const {resolve, isMocked} = options;
        const {source} = path.node;
        const {value} = source;
        const resolved = resolve(value);
        
        if (isMocked(source))
            push({
                path,
                resolved,
            });
    },
});

export default {
    report,
    fix,
    traverse,
};

