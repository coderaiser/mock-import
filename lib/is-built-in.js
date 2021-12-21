const builtInsList = [
    'assert',
    'async_hooks',
    'buffer',
    'child_process',
    'cluster',
    'console',
    'crypto',
    'dgram',
    'diagnostics_channel',
    'dns',
    'domain',
    'fs',
    'http',
    'http2',
    'https',
    'inspector',
    'module',
    'os',
    'path',
    'perf_hooks',
    'punycode',
    'querystring',
    'readline',
    'repl',
    'stream',
    'string_decoder',
    'timers',
    'tls',
    'trace_events',
    'tty',
    'url',
    'util',
    'vm',
    'web_crypto_api',
    'web_streams_api',
    'wasi',
    'worker_threads',
    'zlib',
];

export const isBuiltIn = (name) => builtInsList.includes(name);