import {run} from 'madrun';

const NODE_OPTIONS = `'--loader ./lib/mock-import.js'`;

export default {
    'test:base': () => `tape 'test/**/*.js' 'lib/**/*.spec.js'`,
    'test': async () => await run('test:base', '', {
        NODE_OPTIONS,
    }),
    'coverage:base': async () => `c8 --exclude="lib/**/{fixture,*.spec.js}" ${await run('test:base')}`,
    'coverage': async () => await run('coverage:base', '', {
        NODE_OPTIONS,
    }),
    'lint': () => 'putout .',
    'fix:lint': () => run('lint', '--fix'),
    'report': () => 'nyc report --reporter=text-lcov | coveralls',
    'watcher': () => 'nodemon -w test -w lib --exec',
    'watch:test': async () => await run('watcher', `"${await run('test:base')}"`, {
        NODE_OPTIONS,
    }),
    'watch:lint': () => run('watcher', '\'npm run lint\''),
    'watch:tape': () => 'nodemon -w test -w lib --exec tape',
    'watch:coverage:base': async () => await run('watcher', 'nyc npm test', {
        NODE_OPTIONS,
    }),
    'watch:coverage:tape': () => run('watcher', 'nyc tape'),
    'watch:coverage': () => 'bin/redrun.js watch:coverage:base',
};

