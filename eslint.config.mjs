import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import path from 'path';

const __dirname = path.resolve('.');

export default tseslint.config(
    tseslint.configs.strict,
    eslint.configs.recommended,
    // 自定义配置需要放在strict配置之前以覆盖其规则
    [
        {
            files: ['**/*.ts', '**/*.tsx'],  // 使用**匹配嵌套目录
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
                    project: [__dirname + '/tsconfig.json', __dirname + '/tsconfig.test.json']
                },
                globals: {
                    ...globals.browser
                }
            }
        },
        {
            files: ['scripts/*.mjs'],
            languageOptions: {
                globals: {
                    ...globals.node,
                    '$': 'readonly',
                    'fs': 'readonly',
                    'path': 'readonly',
                    'argv': 'readonly'
                }
            },
            rules: {
                "@typescript-eslint/no-require-imports": 'off'
            }
        },
        {
            ignores: [
                '**/lib',
                '.github',
                '.husky'
            ],
            plugins: {
                prettier: prettier
            },
            rules: {
                'prettier/prettier': 'error'
            }
        }
    ]
)
