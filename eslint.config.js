import {
    matchToFlat,
    createESLintConfig,
} from '@putout/eslint-flat';
import {safeAlign} from 'eslint-plugin-putout/config';

export const match = {
    '**/{fresh,register.js}': {
        'n/no-unsupported-features/node-builtins': 'off',
    },
};

export default createESLintConfig([safeAlign, matchToFlat(match)]);
