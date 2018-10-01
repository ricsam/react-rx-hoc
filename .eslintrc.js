module.exports = {
  root: true,
  parser: 'babel-eslint',
  plugins: ['react'],
  extends: 'airbnb',
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react/jsx-filename-extension': 0,
    'import/no-extraneous-dependencies': 0,
    'react/no-multi-comp': 0
  },
};
