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
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:prettier/recommended",
  ],

  // Set up es6 and typescript linting, and add lint rules for jest
  plugins: [
    "jest",
    "prettier",
    "header",
  ],

  // A few fixes for broken .eslint rules
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },

  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"],
      },
    },
  },

  rules: {
    // Don't allow overwriting built-in globals like URL
    "no-shadow": ["error", { "builtinGlobals": true }],

    // Make everything work with .ts and .tsx as well
    "import/extensions": ["error", {
      js: "never",
      ts: "never",
      tsx: "never",
    }],

    // Allow devDeps in test files
    "import/no-extraneous-dependencies": ["off", {
      "devDependencies": ["**/*.test.*"],
    }],

    // import/no-unresolved is problematic because of the RDF/JS specification, which has type
    // definitions available in @types/rdf-js, but no actual corresponding rdf-js package.
    "import/no-unresolved": ["error", {
      ignore: ['rdf-js'],
    }],

    // Remove airbnb's ForOfStatement recommendation; we don't use regenerator-runtime anywyas,
    // and we iterate over Sets in our libraries.
    "no-restricted-syntax": ["error", {
      selector: "ForInStatement",
      message: "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
    }, {
      selector: "LabeledStatement",
      message: "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
    }, {
      selector: "WithStatement",
      message: "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
    }],

    // Leaving out the await can hide the fact that you're not catching thrown errors:
    // https://twitter.com/_jayphelps/status/1324565522755788803
    // Additionally, it will prevent the function from being part of the stack trace
    // if not catching them:
    // https://eslint.org/docs/rules/no-return-await
    // Thus, we use the rule that can use type annotation to ensure we await Promises used in
    // try..catch blocks:
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/return-await.md
    "no-return-await": ["off"],

    "header/header": ["warn", "./resources/license-header.js"],

    // set eol to auto to handle all environments
    "prettier/prettier": [
      "error",
      { endOfLine: "auto" },
    ],
  },
}
