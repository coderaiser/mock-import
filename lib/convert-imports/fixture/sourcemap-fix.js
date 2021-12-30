const {
  a: a
} = await global.__reImport('b', import.meta.url);

//{"version":3,"sources":["hello.js"],"names":[],"mappings":";;4BAAgB,CAAC,CAAC","file":"world.map","sourcesContent":["import {a} from 'b';\n"]}
