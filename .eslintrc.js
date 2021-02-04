module.exports = {
  globals: {
    VERSION: 'readonly',
    ROUTER_MODE: 'readonly',
    BUILD_TYPE: 'readonly',
    NODE_ENV: 'readonly',
    FULL_SOURCEMAPS: 'readonly'
  },
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/prettier',
    '@vue/typescript',
    'eslint:recommended',
    'plugin:security/recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-else-return': ['error', { allowElseIf: true }],
    'arrow-parens': 'off',
    'generator-star-spacing': 'off',
    semi: 'off',
    'prefer-const': 'error',
    'no-var': 'error',
    'security/detect-new-buffer': 'off',
    'security/detect-object-injection': 'off',
    'require-atomic-updates': 'off',
    'no-prototype-builtins': 'off'
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  plugins: ['security']
};
