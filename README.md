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

```sh
npm i mock-import -D
```

## Run

[Loaders](https://nodejs.org/api/esm.html#esm_loaders) used to get things working, so you need to run tests with:

```sh
node --loader mock-import test.js
```

`mock-import` uses [transformSource hook](https://nodejs.org/api/esm.html#esm_transformsource_source_context_defaulttransformsource), which replaces on the fly all imports with constants declaration:

```js
const {readFile} = global.__mockImportCache.get('fs/promises');
```

`mockImport` adds new entry into `Map`, `stopAll` clears all mocks and `reImport` imports file again with new mocks applied.

## Supported Declarations

```js
/* ✅ */ const {writeFile} = await import('fs/promses');
/* ✅ */ import fs from 'fs/promises';
/* ✅ */ import {readFile} from 'fs/promises';
/* ✅ */ import * as fs1 from 'fs/promises';
/* ✅ */ export * as fs2 from 'fs/promises';
/* ✅ */ export {readFile as readFile1} from 'fs/promises';
```

## Unsupported Declarations

```js
/* ❌ */ export * from 'fs/promises'; // doesn't have syntax equivalent
```

## API

### mockImport(name, mock)

- `name: string` - module name;
- `mock: object` -  mock data;

Mock `import` of a `module`

### stopAll()

Stop all mocks;

### reImport(name)

- `name: string` - name of a module

Fresh `import` of a module

## traceImport(name, {stack})

- `name: string` name of a module
- `stack: [fn, url, args]`;

Add tracing of a module.

## reTraceImport(name)

- `name: string` - name of traced module

Apply tracing.

## Example

Let's suppose you have `cat.js`:

```js
import {readFile} from 'fs/promises';

export default async function cat() {
    const readme = await readFile('./README.md', 'utf8');
    return readme;
}
```

You can test it with [supertape](https://github.com/coderaiser/supertape):

```js
import {createImport} from 'mock-import';
import {
    test,
    stub,
} from 'supertape';

const {
    mockImport,
    reImport,
    stopAll,
} = createMockImport(import.meta.url);

test('cat: should call readFile', async (t) => {
    const readFile = stub();
    
    mockImport('fs/promises', {
        readFile,
    });
    
    const cat = await reImport('./cat.js');
    await cat();
    
    stopAll();
    
    t.calledWith(readFile, ['./README.md', 'utf8']);
    t.end();
});
```

Now let's trace it:

```js
import {createImport} from 'mock-import';
import {
    test,
    stub,
} from 'supertape';

const {
    mockImport,
    reImport,
    stopAll,
} = createMockImport(import.meta.url);

test('cat: should call readFile', async (t) => {
    const stack = [];
    traceImport('fs/promises', {stack});
    
    const cat = await reImport('./cat.js');
    await cat();
    
    stopAll();
    
    t.calledWith(readFile, ['./README.md', 'utf8']);
    t.end();
});
```

## License

MIT
