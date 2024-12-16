import conventional from '@commitlint/config-conventional';

export default {
  extends: ['@commitlint/config-conventional'],
  plugins: ['commitlint-plugin-function-rules'],
  helpUrl: 'https://github.com/conventional-changelog/commitlint',
  rules: {
    ...conventional.rules,
    'type-enum': [
      2, // 1: warn, 2: error
      'always',
      [
        'build',
        'chore',
        'ci',
        'design',
        'docs',
        'feat',
        'feature',
        'fix',
        'hotfix',
        'refactor',
        'style',
        'test',
      ],
    ],
    'function-rules/header-max-length': [0],
  },
};
