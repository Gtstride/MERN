module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ["airbnb"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["react"],
  rules: {
    "no-console": 0,
    "no-restricted-syntax": "off",
    "no-shadow": 0,
    "consistent-return": "off",
    "prefer-destructuring": "off",
    "camelcase": 0,
    "no-undef": 0,
    "no-multi-assign": "off",
    "no-param-reassign": "off",
    "no-use-before-define": "off",
    "no-unused var": "off",
    "max-len":"off",
    "no-underscore-dangle": 1,
  }
};
