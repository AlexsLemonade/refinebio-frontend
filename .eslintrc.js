module.exports = {
  extends: [
    'airbnb',
    'react-app',
    'prettier',
    'prettier/react',
    'prettier/flowtype',
  ],
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
        ignoreComments: true, // let's disable warnings on the comments
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
    'no-unused-vars': 2,
    'no-func-assign': 0,

    // Not sure if we should enforce these rules.
    'class-methods-use-this': 0,
    'react/prop-types': 0,
    'no-nested-ternary': 'warn',
    'no-class-assign': 0,
    'no-restricted-syntax': 0,
    'no-continue': 0,
    'react/destructuring-assignment': 0,
    'react/no-unescaped-entities': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'import/prefer-default-export': 0,
    'no-use-before-define': 0,
    'react/no-multi-comp': 0,
    // without decorators it's harder to create components that need to call `connect`
    'import/no-mutable-exports': 0,

    // these should be enabled gradually
    'react/no-did-update-set-state': 'warn',
    'dot-notation': 0, // <- make it so it only transforms camel case identifiers
    'no-underscore-dangle': 'warn',
    'react/sort-comp': 'warn', // sorting of methods
    'no-shadow': 'warn',
    'prefer-destructuring': 'warn',
    'no-param-reassign': 'warn',

    // this should be fixed in header/headerA
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',

    // deprecated
    'jsx-a11y/label-has-for': 0,

    // TODO DISABLE THIS AFTER NEXTJS MIGRATION
    'no-unused-vars': 0,
    'jsx-a11y/interactive-supports-focus': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'import/no-unresolved': 0,
  },
};
