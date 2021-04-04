# Mock Import [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

[NPMIMGURL]: https://img.shields.io/npm/v/mock-import.svg?style=flat
[DependencyStatusIMGURL]: https://img.shields.io/david/coderaiser/mock-import.svg?style=flat
[BuildStatusURL]: https://github.com/coderaiser/mock-import/actions?query=workflow%3A%22Node+CI%22 "Build Status"
[BuildStatusIMGURL]: https://github.com/coderaiser/mock-import/workflows/Node%20CI/badge.svg
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]: https://npmjs.org/package/mock-import "npm"
[DependencyStatusURL]: https://david-dm.org/coderaiser/mock-import "Dependency Status"
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
[CoverageURL]: https://coveralls.io/github/coderaiser/mock-import?branch=master
[CoverageIMGURL]: https://coveralls.io/repos/coderaiser/mock-import/badge.svg?branch=master&service=github

Mocking of Node.js [EcmaScript Modules](https://nodejs.org/api/esm.html#esm_modules_ecmascript_modules), similar to [mock-require](https://github.com/boblauer/mock-require).

## Install

`npm i mock-import`

## Run

[Loaders](https://nodejs.org/api/esm.html#esm_loaders) used to get things working, so you need to run tests with:

```sh
node --loader mock-import test.js
```

## Example

Let's suppose you have next two files:

```js
// impl.js
import data from './data.js';

export const get = () => {
    return data;
};
```

```js
// data.js
export default 'xxx';
```

Here is how test can look like:

```js
import impl from './impl.js';
import {createMockImport} from 'mock-import';

const {mockImport, reImport} = createMockImport(import.meta.url);

impl.get();
// returns
'xxx';

mockImport('./data.js', 'abc');
const impl2 = await reImport('./impl.js');
impl2.get();
// returns
'abc';

mockImport('./data.js', 'cba');
const impl3 = await reImport('./impl.js');
impl3.get();
// returns
'cba';
```

## License

MIT

