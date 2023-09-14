import {basename} from 'node:path';
import putout from 'putout';
import estracePlugin from 'estrace/plugin';

const noop = () => {};

export function traceImports({url, source, stack}) {
    global.__estrace = {
        enter: (name, url, args) => stack.push([name, url, Array.from(args)]),
        exit: noop,
    };
    
    const {code} = putout(source, {
        rules: {
            'estrace/trace': ['on', {
                url: parseUrl(url),
            }],
        },
        plugins: [
            ['estrace', estracePlugin],
        ],
    });
    
    return code;
}

function parseUrl(url) {
    const base = basename(new URL(url).pathname);
    return base.replace(/\?count=\d/, '');
}
