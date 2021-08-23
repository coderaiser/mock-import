export const isInCache = (cache) => ({__b}) => {
    const {value} = __b;
    
    return cache.has(value);
};

