import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import pluginVitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import checkFile from 'eslint-plugin-check-file'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  {
    name: 'app/files-to-lint',
    files: ['src/**/*.{ts,mts,tsx,vue}', 'export_wallet/**/*.{ts,tsx}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      'v6/*',
      'scripts/*',
      'package-*.js',
      'nightwatch/*',
      'fetchLists/*',
      'builds/*',
      '.history/*',
      '.husky/*',
      '.vscode/*',
      '.github/*',
      'node_modules/*',
      'public/*',
      'devmoji.config.js',
    ],
  },

  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },
  skipFormatting,
  {
    files: ['src/**/*'],
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      // Components read top to bottom: markup, then logic, then styles.
      'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{vue}': 'PASCAL_CASE',
          '**/*.{js,ts}': 'CAMEL_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/**/': 'SNAKE_CASE',
        },
      ],
    },
  },
  {
    // The wallet export page is the one React part of the repo
    // (export_wallet/ExportWalletPage.tsx): hooks get React's own checks.
    name: 'export-wallet/react-hooks',
    files: ['export_wallet/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
  {
    name: 'tests/no-explicit-any',
    files: ['tests/**/*.{ts,mts}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]
