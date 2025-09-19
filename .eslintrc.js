module.exports = {
  root: true,
  extends: [
    '@react-native',
    'prettier', // Disables ESLint rules that conflict with Prettier
  ],
  env: {
    'react-native/react-native': true,
    jest: true,
    es6: true,
    node: true,
  },
  rules: {
    // React Native specific
    'react-native/no-unused-styles': 'warn', // Changed to warn since it's a working project
    'react-native/split-platform-components': 'error',
    'react-native/no-inline-styles': 'off', // Turned off for flexibility
    'react-native/no-color-literals': 'off', // Turned off for simplicity
    'react-native/no-raw-text': 'off', // Sometimes needed for custom text components

    // General code quality
    'no-console': 'off', // Allow console logs in React Native
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',

    // Disable problematic rules that conflict with React Native setup
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
