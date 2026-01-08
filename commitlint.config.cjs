const MAXIMUM_BODY_LENGTH = 500

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [2, 'always', MAXIMUM_BODY_LENGTH],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'ui',
        'feature',
        'ci',
        'devop',
        'chore',
        'docs',
        'feat',
        'fix',
        'refactor',
        'revert',
        'style',
        'lint',
        'test',
        'translation',
        'sentry',
        'release',
      ],
    ],
  },
}
