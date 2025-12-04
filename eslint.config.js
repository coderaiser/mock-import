import {matchToFlat} from '@putout/eslint-flat';
import {safeAlign} from 'eslint-plugin-putout';
import {defineConfig} from 'eslint/config';

export const match = {
    '**/{fresh,register.js}': {
        'n/no-unsupported-features/node-builtins': 'off',
    },
};

export default defineConfig([safeAlign, matchToFlat(match)]);
