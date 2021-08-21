const {
  readFile: _temp
} = global.__mockImportCache.get('fs/promises');

export {_temp as readFile};

const readFile = () => {
};
