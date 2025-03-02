import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

export default tseslint.config(
    tseslint.configs.strict,
    eslint.configs.recommended,
    // 自定义配置需要放在strict配置之前以覆盖其规则
    [
        {
            files: ['**/*.ts', '**/*.tsx'], // 使用**匹配嵌套目录
            rules: {
                'no-console': 'off',
                'no-bitwise': 'off',
                quotes: ['error', 'single'],
                'max-len': ['error', 120],
                'arrow-parens': 'off',
                'no-unused-vars': 'off',
                '@typescript-eslint/no-dynamic-delete': 'off',
                '@typescript-eslint/no-unsafe-function-type': 'off',
                '@typescript-eslint/no-unused-vars': 'error'
            },
            languageOptions: {
                parserOptions: {
                    projectService: true
                },
                globals: {
                    ...globals.browser
                }
            }
        },
        {
            files: ['build/*.ts'],
            languageOptions: {
                parserOptions: {
                    projectService: true
                },
                globals: {
                    ...globals.node
                }
            },
            rules: {
                '@typescript-eslint/no-require-imports': 'off'
            }
        },
        {
            files: ['scripts/*.mjs'],
            languageOptions: {
                globals: {
                    ...globals.node,
                    $: 'readonly',
                    fs: 'readonly',
                    path: 'readonly',
                    argv: 'readonly'
                }
            },
            rules: {
                '@typescript-eslint/no-require-imports': 'off'
            }
        },
        {
            files: ['rollup.*.js', 'commitlint.config.js'],
            languageOptions: {
                globals: {
                    ...globals.node
                }
            },
            rules: {
                '@typescript-eslint/no-require-imports': 'off'
            }
        },
        {
            files: ['packages/mock-server/src/**/*.ts'],
            languageOptions: {
                globals: globals.node
            }
        },
        {
            ignores: [
                '**/lib',
                '.github',
                '.husky',
                '**/dist',
                'packages/ioc/**'
            ],
            plugins: {
                prettier: prettier
            },
            rules: {
                'prettier/prettier': 'error'
            }
        }
    ]
);
