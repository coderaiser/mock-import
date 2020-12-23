# Mock Import [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

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
// impl.mjs
import data from './data.mjs';

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
import impl from './impl.mjs';
import {createMockImport} from 'mock-import';

const {mockImport, reImport} = createMockImport(import.meta);

impl.get();
// returns
'xxx';

mockImport('./data.mjs', 'abc');
const impl2 = await reImport('./impl.mjs');
impl2.get();
// returns
'abc';

mockImport('./data.mjs', 'cba');
const impl3 = await reImport('./impl.mjs');
impl3.get();
// returns
'cba';
```

## License

MIT

[NPMIMGURL]: https://img.shields.io/npm/v/mock-import.svg?style=flat
[BuildStatusIMGURL]: https://travis-ci.com/coderaiser/mock-import.svg?branch=master
[DependencyStatusIMGURL]: https://img.shields.io/david/coderaiser/mock-import.svg?style=flat
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]: https://npmjs.org/package/mock-import "npm"
[BuildStatusURL]: https://travis-ci.org/github/coderaiser/mock-import "Build Status"
[DependencyStatusURL]: https://david-dm.org/coderaiser/mock-import "Dependency Status"
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
[CoverageURL]: https://coveralls.io/github/coderaiser/mock-import?branch=master
[CoverageIMGURL]: https://coveralls.io/repos/coderaiser/mock-import/badge.svg?branch=master&service=github
