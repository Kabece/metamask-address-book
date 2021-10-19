// @ts-ignore
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
    settings: {
      react: {
        version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
  },
  ignorePatterns: ['/.eslintrc.js', 'node_modules', 'jest.config.js'], // ignore the file itself, otherwise ts parser complains
  plugins: [
    '@typescript-eslint',
    'jsx-a11y',
    'sonarjs',
    'import',
    'testing-library',
    'jest',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'airbnb',
    'airbnb/hooks',
    'plugin:jsx-a11y/recommended',
    'plugin:sonarjs/recommended',
    'prettier',
    'prettier/react',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'react-app',
    'react-app/jest',
  ],
  rules: {
    // Disabling these rules as TS does this instead
    'import/no-unresolved': 'off',
    // Using custom extensions (e.g. .container)
    'import/extensions': 'off',

    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.ts', '**/*.test.tsx'] },
    ],

    'no-use-before-define': 'off',
    'no-undef': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-underscore-dangle': 'off',
    'no-void': ['error', { allowAsStatement: true }],

    // No need for prop types with typescript
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
    'react/no-multi-comp': 'off',
    'react/jsx-fragments': ['error', 'element'],

    // Eslint rules to be disabled while the respective TS rules are enabled to avoid conflicts
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',

    'react/react-in-jsx-scope': 'off',
    'sonarjs/cognitive-complexity': ['error', 20],
  },
}
