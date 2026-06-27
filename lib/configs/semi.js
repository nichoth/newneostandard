'use strict'

module.exports = /** @satisfies {import('eslint').Linter.Config} */({
  name: 'newneostandard/semi',

  rules: {
    '@stylistic/semi': ['error', 'always'],
    '@stylistic/no-extra-semi': 'error',
  },
})
