import {
    run,
    cutEnv,
} from 'madrun';

const NODE_OPTIONS = `'--loader ./lib/mock-import.js'`;
const testEnv = {
    NODE_OPTIONS,
};

export default {
    'test': () => [testEnv, `tape 'test/**/*.js' 'lib/**/*.spec.js'`],
    'coverage': async () => [testEnv, `c8 --exclude="lib/**/{fixture,*.spec.js}" ${await cutEnv('test')}`],
    'lint': () => 'putout .',
    'fresh:lint': () => run('lint', '--fresh'),
    'lint:fresh': () => run('lint', '--fresh'),
    'fix:lint': () => run('lint', '--fix'),
    'report': () => 'c8 report --reporter=lcov',
    'watcher': () => 'nodemon -w test -w lib --exec',
    
    'watch:test': async () => await run('watcher', `"${await cutEnv('test')}"`, testEnv),
    
    'watch:lint': () => run('watcher', '\'npm run lint\''),
    'watch:tape': () => 'nodemon -w test -w lib --exec tape',
    
    'watch:coverage': async () => await run('watcher', await cutEnv('coverage'), testEnv),
};

