module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-underscore-dangle': [
      2,
      {
        allow: [
          '_isChecked',
          '_isIndeterminate',
          '_isDisabled',
          '_isHidden',
          '_isFolded',
          '_isExpanded',
          '_childrenLength',
          '_level',
          '_path',
          '_index',
        ],
      },
    ],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
