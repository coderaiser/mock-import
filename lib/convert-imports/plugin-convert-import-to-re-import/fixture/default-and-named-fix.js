{
    const test = (await global.__reImport('supertape', import.meta.url)).default;
    const {stub: stub} = await global.__reImport('supertape', import.meta.url);
}
export {
    stub,
};
