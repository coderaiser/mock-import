export const report = () => '';

export const fix = ({path, resolved}) => {
    path.node.source.value = resolved;
};

export const traverse = ({push, options}) => ({
    ImportDeclaration(path) {
        const {cache, resolve} = options;
        
        const {value} = path.node.source;
        const resolved = resolve(value);
        
        if (cache.has(resolved))
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
