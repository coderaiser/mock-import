export const report = () => '';

export const fix = ({path, resolved}) => {
    const {raw, value} = path.node.source;
    
    path.node.source.value = value.replace(value, resolved);
    path.node.source.raw = raw.replace(value, resolved);
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
