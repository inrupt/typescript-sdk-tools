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
  env: {
    browser: true,
    es6: true,
  },

  // Airbnb base provides many style rules; it is then overridden by our current defaults
  // (jest, eslint, typescript, and finally prettier recommended configs.)
  extends: [
    "airbnb-base",
    "eslint:recommended",
    "plugin:import/typescript",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
  ],

  // Set up es6 and typescript linting, and add lint rules for jest
  plugins: [
    "@typescript-eslint",
    "jest",
    "prettier",
  ],

  // A few fixes for broken .eslint rules
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },

  parser: "@typescript-eslint/parser",

  // Load typescript rules to handle es6 and typescript
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: 2018,
    sourceType: "module",
  },

  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"],
        paths: ["node_modules/", "node_modules/@types"],
      },
    },
  },

  rules: {
    // Don't allow overwriting built-in globals like URL
    "no-shadow": ["error", { "builtinGlobals": true }],

    // Make everything work with .ts and .tsx as well
    "import/extensions": [2, {
      js: "never",
      ts: "never",
      tsx: "never",
    }],

    // Allow devDeps in test files
    "import/no-extraneous-dependencies": [0, {
      "devDependencies": ["**/*.test.*"],
    }],

    // TODO: Discuss whether we should we prefer default exports (as in airbnb base) or no default exports (as follows)
    // "import/prefer-default-export": 0,
    // "import/no-default-export": 2,

    // Remove airbnb's ForOfStatement recommendation; we don't use regenerator-runtime anywyas,
    // and we iterate over Sets in our libraries.
    "no-restricted-syntax": [2, {
      selector: "ForInStatement",
      message: "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
    }, {
      selector: "LabeledStatement",
      message: "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
    }, {
      selector: "WithStatement",
      message: "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
    }],

    // Allow empty arrow functions, useful as defaults or for testing mocks
    "@typescript-eslint/no-empty-function": [
      "error", { "allow": ["arrowFunctions"] }
    ],

    "@typescript-eslint/no-floating-promises": "error",

    // We allow underscores in some situations, such as internal_ or unstable_. Additionally,
    // many of the libraries we use commonly use underscores, so disable this rule.
    "@typescript-eslint/camelcase": [0],
  },
}
