/*
Copyright 2020 Inrupt Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

module.exports = {
  extends: [
    "@inrupt/eslint-config-base",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint"
  ],

  plugins: [
    "@typescript-eslint"
  ],

  parser: "@typescript-eslint/parser",

  // Load typescript rules to handle es6 and typescript
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: 2018,
    sourceType: "module",
  },

  rules: {
    "@typescript-eslint/return-await": ["error", "in-try-catch"],

    // Allow empty arrow functions, useful as defaults or for testing mocks
    "@typescript-eslint/no-empty-function": [
      "error", { "allow": ["arrowFunctions"] }
    ],

    "@typescript-eslint/no-floating-promises": "error",

    // We allow underscores in some situations, such as internal_ or unstable_. Additionally,
    // many of the libraries we use commonly use underscores, so disable this rule.
    "@typescript-eslint/camelcase": ["off"],

    // Use typescript's definition checker
    "no-use-before-define": ["off"],
    "@typescript-eslint/no-use-before-define": ["warn"],
  },
}
