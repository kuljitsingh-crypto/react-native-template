module.exports = {
  root: true,
  extends: '@react-native',
  requireConfigFile: false, // <== ADD THIS
  ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
  sourceType: 'module', // Allows for the use of imports
  rules: {
    'prettier/prettier': 0,
  },
};
