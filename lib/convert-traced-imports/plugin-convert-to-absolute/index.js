export const report = () => '';

export const fix = ({path, resolved, nextCount}) => {
    path.node.source.value = `${resolved}?count=${nextCount()}`;
};

export const traverse = ({push, options}) => ({
    ImportDeclaration(path) {
        const {
            traceCache,
            resolve,
            nextCount,
        } = options;
        
        const {value} = path.node.source;
        
        if (value.includes('?count'))
            return;
        
        const resolved = resolve(value);
        
        if (traceCache.has(resolved))
            push({path, resolved, nextCount});
    },
});

export default {
    report,
    fix,
    traverse,
};

