export const isInCache = (cache, resolve) => ({__a, __b, value}, {returnResolved = false} = {}) => {
    const name = (__b || __a)?.value || value;
    const resolved = resolve(name);
    
    const is = cache.has(resolved);
    
    if (returnResolved)
        return [is, resolved];
    
    return is;
};
