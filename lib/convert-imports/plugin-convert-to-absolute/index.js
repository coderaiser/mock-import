export const report = () => '';

export const fix = ({path, resolved}) => {
    path.node.source.value = resolved;
};

export const traverse = ({push, options}) => ({
    ImportDeclaration(path) {
        const {isMocked} = options;
        const {source} = path.node;
        
        const [is, resolved] = isMocked(source, {
            returnResolved: true,
        });
        
        if (is)
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
