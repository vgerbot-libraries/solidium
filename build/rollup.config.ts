import { OutputOptions, RollupOptions } from 'rollup';
import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import html from '@rollup/plugin-html';
import serve from '@rollup-extras/plugin-serve';
import alias from '@rollup/plugin-alias';

const pkg = require(path.resolve(process.cwd(), 'package.json'));

const inputFile = path.resolve(process.cwd(), 'src/index.ts');

const isServingExamples =
    process.env.NODE_ENV === 'development' && pkg.name.indexOf('examples') > -1;

const outputConfig = [
    [pkg.browser, 'umd'],
    [pkg.module, 'es'],
    [pkg.main, 'cjs']
]
    .filter(it => !!it[0])
    .map(confs => createOutputConfig(confs[0], confs[1]));

const extensions = ['.ts', '.tsx', '.js', '.jsx'];

// Main bundle configuration
const mainConfig: RollupOptions[] = outputConfig.map(output => {
    return {
        output: output,
        input: inputFile,
        watch: isServingExamples
            ? {
                  chokidar: {
                      ignored: '*/node_moduless/**'
                  }
              }
            : false,
        plugins: [
            nodeResolve({
                mainFields: ['module', 'browser', 'main'],
                extensions
            }),
            commonjs({
                include: 'node_modules/**',
                ignore: [],
                sourceMap: false,
                extensions
            }),
            typescript({
                exclude: 'node_modules/**',
                tsconfig: path.resolve(process.cwd(), 'tsconfig.json'),
                tsconfigOverride: {
                    compilerOptions: {
                        target: output.format === 'es' ? 'es6' : 'es5',
                        declarationDir: 'lib/typings'
                    }
                },
                useTsconfigDeclarationDir: true
            }),
            babel({
                extensions,
                babelHelpers: 'bundled',
                presets: ['solid', '@babel/preset-typescript'],
                exclude: /node_modules\//,
                plugins: [
                    [
                        '@babel/plugin-proposal-decorators',
                        {
                            legacy: true
                        }
                    ]
                ]
            }),
            isServingExamples && html(),
            isServingExamples &&
                serve({
                    port: Number(process.env.SERVE_PORT),
                    dirs: 'dist'
                }),
            isServingExamples &&
                alias({
                    entries: [
                        {
                            find: '@vgerbot/solidium',
                            replacement: path.resolve(
                                process.cwd(),
                                '../../solidium/src/index.ts'
                            )
                        },
                        {
                            find: '@vgerbot/http',
                            replacement: path.resolve(
                                process.cwd(),
                                '../../http/src/index.ts'
                            )
                        },
                        {
                            find: '@vgerbot/solidium-persistence',
                            replacement: path.resolve(
                                process.cwd(),
                                '../../persistence/src/index.ts'
                            )
                        },
                        {
                            find: '@vgerbot/msgpack-ext',
                            replacement: path.resolve(
                                process.cwd(),
                                '../../msgpack-ext/src/index.ts'
                            )
                        }
                    ]
                })
        ].filter(Boolean),
        external: isServingExamples
            ? []
            : new RegExp('node_modules|@vgerbot\\/')
    } as RollupOptions;
});

function createOutputConfig(
    file: string,
    format: string,
    cfg: OutputOptions = {}
): OutputOptions {
    return Object.assign(
        {
            file: path.resolve(process.cwd(), file),
            format,
            sourcemap: true,
            name: pkg.library,
            globals: {
                '@msgpack/msgpack': 'MessagePack',
                'is-plain-object': 'isPlainObject',
                '@vgerbot/ioc': 'IOC',
                '@vgerbot/solidium': 'Solidium',
                '@vgerbot/persistence': 'SolidiumPersistence',
                '@vgerbot/http': 'SolidiumHttp',
                '@vgerbot/msgpack-ext': 'MPext'
            },
            exports: 'named'
        },
        cfg || {}
    );
}

export default mainConfig;
