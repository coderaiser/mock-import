export const isInCache = (cache) => ({__b}) => {
    const value = __b.value.replace('\\?count=\\d', '');
    
    return cache.has(value);
};

