import babelParser from '@babel/eslint-parser';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginPromise from 'eslint-plugin-promise';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import vueEslintParser from 'vue-eslint-parser';

export default [
    {
        ignores: [
            'dist/**',
            'node_modules/**',
            'public/**',
            '.nuxt/**',
            '.output/**',
            '*.json',
            '*.config.js',
            '*.config.ts',
            '.prettierrc',
            '.prettierignore',
            'tailwind.config.js',
            'eslint.config.js',
        ],
    },
    {
        files: ['**/*.vue'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.browser,
            parser: vueEslintParser,
            parserOptions: {
                parser: {
                    js: babelParser,
                    ts: tsParser,
                },
                requireConfigFile: false,
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            vue: eslintPluginVue,
            prettier: eslintPluginPrettier,
        },
        rules: {
            'prettier/prettier': 'error',
            'vue/html-self-closing': [
                'error',
                {
                    html: {
                        void: 'always',
                        normal: 'always',
                        component: 'always',
                    },
                },
            ],
            'vue/attributes-order': [
                'error',
                {
                    order: [
                        'DEFINITION',
                        'LIST_RENDERING',
                        'CONDITIONALS',
                        'RENDER_MODIFIERS',
                        'GLOBAL',
                        'UNIQUE',
                        'TWO_WAY_BINDING',
                        'OTHER_DIRECTIVES',
                        'OTHER_ATTR',
                        'EVENTS',
                        'CONTENT',
                    ],
                    alphabetical: false,
                },
            ],
            'vue/order-in-components': [
                'error',
                {
                    order: [
                        'el',
                        'name',
                        'key',
                        'parent',
                        'functional',
                        ['delimiters', 'comments'],
                        ['components', 'directives', 'filters'],
                        'extends',
                        'mixins',
                        ['provide', 'inject'],
                        'ROUTER_GUARDS',
                        'layout',
                        'middleware',
                        'validate',
                        'scrollToTop',
                        'transition',
                        'loading',
                        'inheritAttrs',
                        'model',
                        ['props', 'propsData'],
                        'emits',
                        'setup',
                        'asyncData',
                        'data',
                        'fetch',
                        'head',
                        'computed',
                        'watch',
                        'watchQuery',
                        'methods',
                        ['template', 'render'],
                        'renderError',
                    ],
                },
            ],
        },
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parser: tsParser,
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            import: eslintPluginImport,
            promise: eslintPluginPromise,
            prettier: eslintPluginPrettier,
        },
        rules: {
            'prettier/prettier': 'error',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            'no-console': 'warn',
        },
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
            },
        },
        plugins: {
            import: eslintPluginImport,
            promise: eslintPluginPromise,
            prettier: eslintPluginPrettier,
        },
        rules: {
            'prettier/prettier': 'error',
            'no-console': 'warn',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
    },
];
