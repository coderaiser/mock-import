import {run, cutEnv} from 'madrun';

const NODE_OPTIONS = `'--no-warnings --import ./lib/register.js'`;
const testEnv = {
    NODE_OPTIONS,
};

export default {
    'test:only': () => [testEnv, `escover tape 'test/**/*.js' 'lib/**/*.spec.js'`],
    'test': async () => [testEnv, await cutEnv('test:only')],
    'test:dts': () => 'check-dts test/errors.ts',
    'coverage': async () => [testEnv, `c8 ${await cutEnv('test:only')}`],
    'lint': () => 'putout .',
    'fresh:lint': () => run('lint', '--fresh'),
    'lint:fresh': () => run('lint', '--fresh'),
    'fix:lint': () => run('lint', '--fix'),
    'wisdom': () => run(['lint', 'test', 'test:dts']),
    'report': () => 'c8 report --reporter=lcov',
    'watcher': () => 'nodemon -w test -w lib --exec',
    'watch:test': async () => await run('watcher', `"${await cutEnv('test')}"`, testEnv),
    'watch:lint': async () => await run('watcher', `'npm run lint'`),
    'watch:tape': () => 'nodemon -w test -w lib --exec tape',
    'watch:coverage': async () => await run('watcher', await cutEnv('coverage'), testEnv),
};
