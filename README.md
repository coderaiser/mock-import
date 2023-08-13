# Mock Import [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

[NPMIMGURL]: https://img.shields.io/npm/v/mock-import.svg?style=flat
[BuildStatusURL]: https://github.com/coderaiser/mock-import/actions?query=workflow%3A%22Node+CI%22 "Build Status"
[BuildStatusIMGURL]: https://github.com/coderaiser/mock-import/workflows/Node%20CI/badge.svg
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]: https://npmjs.org/package/mock-import "npm"
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
[CoverageURL]: https://coveralls.io/github/coderaiser/mock-import?branch=master
[CoverageIMGURL]: https://coveralls.io/repos/coderaiser/mock-import/badge.svg?branch=master&service=github

Mocking of Node.js [EcmaScript Modules](https://nodejs.org/api/esm.html#esm_modules_ecmascript_modules), similar to [mock-require](https://github.com/boblauer/mock-require).

![Recording 2022-06-16 at 19 41 04](https://user-images.githubusercontent.com/1573141/174126105-58ba2664-d79f-4e1e-8cec-a8e84eb2bc2e.gif)

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
/* ✅ */
import fs from 'fs/promises';
/* ✅ */
import {readFile} from 'fs/promises';
/* ✅ */
import * as fs1 from 'fs/promises';

/* ✅ */
const {writeFile} = await import('fs/promses');

/* ✅ */
export * as fs2 from 'fs/promises';

/* ✅ */
export {readFile as readFile1} from 'fs/promises';
```

## Unsupported Declarations

```js
/* ❌ */
export * from 'fs/promises';
// doesn't have syntax equivalent
```

## How `mock-import` works?

As was said before, [loaders](https://nodejs.org/api/esm.html#esm_loaders) used to get things working. This is `experimental` technology,
but most likely it wan't change. If it will `mock-import` will be adapted according to `node.js API`.

- `loader hook` intercepts into `import` process and get `pathname` of imported file;

- if `pathname` in `reImports` it is processed with 🐊[**Putout**](https://github.com/coderaiser/putout) code transformer, changes all `import` calls to access to `__mockImportsCache` which is a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) filled with data set by `mockImport` call. And appends `sourcemap` at the end, so `node` can generate correct code `coverage`.

```diff
-import glob from 'glob';
+const glob = global.__mockImportCache.get('./glob.js');
```

- if `traceCache` contains `pathname` it calls are traced with [estrace](https://github.com/coderaiser/estrace);

Code like this

```js
const f = () => {};
```

will be changed to

```js
const f = () => {
    try {
        __estrace.enter('<anonymous:1>', 'trace.js:1', arguments);
    } finally {
        __estrace.exit('<anonymous:1>', 'trace.js:1');
    }
};
```

Straight after loading and passed to `traceImport` stack will be filled with data this way:

```js
__estrace.enter = (name, url, args) => stack.push([name, url, Array.from(args)]);
```

And when the work is done `stack` will contain all function calls.

- `traceCache` contains some `paths` current file will be checked for traced imports and change them to form `${path}?count=${count}` to `re-import` them;

## Environment variables

`mock-import` supports a couple env variables that extend functionality:

- `MOCK_IMPORT_NESTED` - transform each `import` statement so mock of module work in nested imports as well (slowdown tests a bit)

## API

### `mockImport(name, mock)`

- `name: string` - module name;
- `mock: object` -  mock data;

Mock `import` of a `module`.

### `stopAll()`

Stop all mocks.

### `reImport(name)`

- `name: string` - name of a module

Fresh `import` of a module.

### `traceImport(name, {stack})`

- `name: string` name of a module
- `stack: [fn, url, args]`;

Add tracing of a module.

### `reTrace(name)`

- `name: string` - name of traced module

Apply tracing.

### `enableNestedImports()`

Enable nested imports, can slowdown tests;

### `disableNestedImports()`

Disable nested imports, use when you do not need nested imports support;

## Example

Let's suppose you have `cat.js`:

```js
import {readFile} from 'fs/promises';

export default async function cat() {
    const readme = await readFile('./README.md', 'utf8');
    return readme;
}
```

You can test it with 📼[`Supertape`](https://github.com/coderaiser/supertape):

```js
import {createMockImport} from 'mock-import';
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
import {createMockImport} from 'mock-import';
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
    
    traceImport('fs/promises', {
        stack,
    });
    
    const cat = await reImport('./cat.js');
    await cat();
    
    stopAll();
    
    const expected = [
        ['parse', 'parser.js:3', [
            'const a = 5',
        ]],
        ['tokenize', 'tokenizer.js:1', [
            'parser call',
            'const a = 5',
        ]],
    ];
    
    t.deepEqual(stack, expected);
    t.end();
});
```

## License

MIT
