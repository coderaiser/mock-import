import {createMockImport} from '..';

// THROWS Expected 1 arguments, but got 0
createMockImport();

const {
    mockImport,
    reImport,
    stop,
    stopAll,
} = createMockImport(import.meta.url);

// THROWS Expected 0 arguments, but got 1.
stopAll('x');

// THROWS Expected 1 arguments, but got 0.
stop();

// THROWS Expected 2 arguments, but got 0.
mockImport();

// THROWS Argument of type '{}' is not assignable to parameter of type 'string'.
mockImport({}, 'x');

// THROWS Argument of type 'never[]' is not assignable to parameter of type 'string'.
reImport([]);

reImport('fs').then(() =>{});
