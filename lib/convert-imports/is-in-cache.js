export const isInCache = (options) => ({__b}) => {
    const {cache} = options;
    const {value} = __b;
    
    return cache.has(value);
};

