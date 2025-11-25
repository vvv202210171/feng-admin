module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/strongly-recommended',
    '@vue/standard',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'generator-star-spacing': 'off',
    'no-mixed-operators': 0,
    'vue/max-attributes-per-line': [
      'error', 
      {
        singleline: 5,  // 单行最多 5 个属性
        multiline: {
          max: 1,  // 多行最多 1 个属性
        },
      },
    ],
    'vue/attribute-hyphenation': 0,
    'vue/html-self-closing': 0,
    'vue/component-name-in-template-casing': 0,
    'vue/html-closing-bracket-spacing': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/no-unused-components': 0,
    'vue/multiline-html-element-content-newline': 0,
    'vue/no-use-v-if-with-v-for': 0,
    'vue/html-closing-bracket-newline': 0,
    'vue/no-parsing-error': ['error', { 'x-invalid-end-tag': false }],
    'no-tabs': 0,
    'quotes': [
      'error',
      'single',
      {
        'avoidEscape': true,
        'allowTemplateLiterals': true,
      },
    ],
    'semi': [
      'error',
      'never',
      {
        'beforeStatementContinuationChars': 'never',
      },
    ],
    'comma-spacing': ['error', { 'before': false, 'after': true }],
    'no-extra-semi': 'error',
    'no-delete-var': 'error',
    'prefer-const': [
      'error',
      {
        'ignoreReadBeforeAssign': false,
      },
    ],
    'template-curly-spacing': 'off',
    'space-before-function-paren': 0,
    'indent': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
