export const report = () => '';

export const fix = ({path, resolved, nextCount}) => {
    path.node.source.value = `${resolved}?count=${nextCount()}`;
};

export const traverse = ({push, options}) => ({
    ImportDeclaration(path) {
        const {
            isTraced,
            nextCount,
        } = options;
        
        const {source} = path.node;
        const {value} = source;
        
        if (value.includes('?count'))
            return;
        
        const [is, resolved] = isTraced(source, {
            returnResolved: true,
        });
        
        if (is)
            push({path, resolved, nextCount});
    },
});

export default {
    report,
    fix,
    traverse,
};

