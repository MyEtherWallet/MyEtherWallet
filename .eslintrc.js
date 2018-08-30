module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/recommended', '@vue/prettier', 'eslint:recommended'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-else-return': ['error', { allowElseIf: true }],
    'arrow-parens': 'off',
    'generator-star-spacing': 'off',
    semi: 'off',
    'prefer-const': 'error',
    'no-var': 'error'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
