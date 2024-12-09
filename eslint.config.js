import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import pluginVitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import checkFile from 'eslint-plugin-check-file'

export default [
  {
    name: 'app/files-to-lint',
    files: ['src/**/*.{ts,mts,tsx,vue}'],
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
      'check-file/no-index': 'error',
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{vue}': 'PASCAL_CASE',
          '**/*.{js,ts}': 'CAMEL_CASE',
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
]
