module.exports = {
  extends: ['airbnb', 'prettier', 'prettier/react', 'prettier/flowtype'],
  plugins: ['react-hooks'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  rules: {
    camelcase: 'warn',
    'max-len': [
      'warn',
      {
        code: 80,
        tabWidth: 2,
        comments: 80,
        ignoreComments: false,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'jsx-a11y/href-no-hash': ['off'],
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
    'react/jsx-one-expression-per-line': 0,
    'no-console': ['error', { allow: ['error'] }], // only allow `console.error` calls
    'react/require-default-props': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'class-methods-use-this': 0,
    'no-use-before-define': 0,

    // Not sure if we should enforce these rules.
    'react/prop-types': 0,
    'no-nested-ternary': 'warn',
    'no-class-assign': 0,
    'no-restricted-syntax': 0,
    'no-continue': 0,
    'react/destructuring-assignment': 0,
    'react/no-unescaped-entities': 0,
    'no-unused-vars': 'warn',

    // these should be enabled gradually
    'dot-notation': 0, // <- make it so it only transforms camel case identifiers
    'react/no-multi-comp': 'warn',
    'no-use-before-define': 'warn',
    'no-underscore-dangle': 'warn',
    'react/sort-comp': 'warn', // sorting of methods
    'no-shadow': 'warn',
    'prefer-destructuring': 'warn',
    'no-param-reassign': 'warn',

    // deprecated
    'jsx-a11y/label-has-for': 0,
  },
};
