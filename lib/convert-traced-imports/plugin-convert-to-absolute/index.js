import {operator} from 'putout';

const {setLiteralValue} = operator;

export const report = () => '';

export const fix = ({path, resolved, nextCount}) => {
    setLiteralValue(path.node.source, `${resolved}?count=${nextCount()}`);
};

export const traverse = ({push, options}) => ({
    ImportDeclaration(path) {
        const {isTraced, nextCount} = options;
        
        const {source} = path.node;
        const {value} = source;
        
        if (value.includes('?count'))
            return;
        
        const [is, resolved] = isTraced(source, {
            returnResolved: true,
        });
        
        if (is)
            push({
                path,
                resolved,
                nextCount,
            });
    },
});

export default {
    report,
    fix,
    traverse,
};
