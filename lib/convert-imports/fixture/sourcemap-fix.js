function cov_2euyb45zad() {
  var path = "/Users/coderaiser/mock-import/lib/convert-imports/hello.js";
  var hash = "b57895a1ce40da6353cd351e8becd59c63f48ca7";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/Users/coderaiser/mock-import/lib/convert-imports/hello.js",
    statementMap: {},
    fnMap: {},
    branchMap: {},
    s: {},
    f: {},
    b: {},
    inputSourceMap: {
      version: 3,
      sources: ["hello.js"],
      names: [],
      mappings: "AAAA;AAAA;AAAA,4BAAgB,GAAhB",
      sourcesContent: ["import {a} from 'b';\n"]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "b57895a1ce40da6353cd351e8becd59c63f48ca7"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_2euyb45zad = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_2euyb45zad();
const {
  a: a
} = await global.__reImport('b', import.meta.url);
