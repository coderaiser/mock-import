import {types} from 'putout';

const id = (a) => a;
const {isImportSpecifier} = types;

export const replaceImport = (init, wrap = id) => ({__imports}) => {
    let defaultImport = '';
    
    const vars = [];
    
    for (const specifier of __imports) {
        const {local, imported} = specifier;
        
        if (isImportSpecifier(specifier)) {
            vars.push(`${imported.name}: ${local.name}`);
            continue;
        }
        
        defaultImport = `const ${local.name} = ${wrap(init)}`;
    }
    
    const destructuring = `{${vars.join(',')}}`;
    const destructuringImport = `const ${destructuring} = ${init}`;
    
    if (!defaultImport)
        return destructuringImport;
    
    if (!vars.length)
        return defaultImport;
    
    return `{
        ${defaultImport};
        ${destructuringImport};
   }`;
};

