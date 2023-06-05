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

const { readFileSync } = require("fs");
const { resolve } = require("path");

const escapeRegexCharacters = (stringToEscape) => stringToEscape
  .replace("(", "\\(")
  .replace(")", "\\)");

const LICENSE_TEXT = readFileSync(
  resolve(__dirname, "license-header.txt")
).toString("utf-8");

module.exports = {
  env: {
    browser: true,
    node: true,
    es2022: true,
  },

  // Airbnb base provides many style rules; it is then overridden by our current defaults
  // (eslint and prettier recommended configs)
  extends: ["airbnb-base", "eslint:recommended", "plugin:prettier/recommended"],
  plugins: ["prettier", "header"],

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
    jest: {
      version: require("jest/package.json").version,
    },
  },

  rules: {
    // Don't allow overwriting built-in globals like URL
    "no-shadow": ["error", { builtinGlobals: true }],

    // Make everything work with .ts and .tsx as well
    "import/extensions": [
      "error",
      {
        js: "never",
        ts: "never",
        tsx: "never",
      },
    ],

    // Allow devDeps in test files
    "import/no-extraneous-dependencies": [
      "off",
      {
        devDependencies: ["**/*.test.*"],
      },
    ],

    // import/no-unresolved is problematic because of the RDF/JS specification, which has type
    // definitions available in @types/rdf-js, but no actual corresponding rdf-js package.
    "import/no-unresolved": [
      "error",
      {
        ignore: ["rdf-js"],
      },
    ],

    // Remove airbnb's ForOfStatement recommendation; we don't use regenerator-runtime anyway,
    // and we iterate over Sets in our libraries.
    "no-restricted-syntax": [
      "error",
      {
        selector: "ForInStatement",
        message:
          "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
      },
      {
        selector: "LabeledStatement",
        message:
          "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
      },
      {
        selector: "WithStatement",
        message:
          "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
      },
    ],

    // Leaving out the await can hide the fact that you're not catching thrown errors:
    // https://twitter.com/_jayphelps/status/1324565522755788803
    // Additionally, it will prevent the function from being part of the stack trace
    // if not catching them:
    // https://eslint.org/docs/rules/no-return-await
    // Thus, we use the rule that can use type annotation to ensure we await Promises used in
    // try..catch blocks:
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/return-await.md
    "no-return-await": ["off"],

    // Ensure all code has a license header:
    "header/header": ["warn", "line",
      LICENSE_TEXT.split("\n").map((line) => line === "" ? "" : {
        // Some lines contain parentheses we don't want to process as regex.
        // Any header containing a year should validate the check.
        "pattern": escapeRegexCharacters(line).replace("CURRENT_YEAR", "\\d{4}"),
        // When adding a new header to a file missing it, each line should start
        // with a space to separate it from the //. Adding a new header will default
        // to the current year.
        "template": " " + line.replace("CURRENT_YEAR", new Date().getUTCFullYear())
      }),
      2
    ],

    // set eol to auto to handle all environments
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },

  overrides: [
    {
      files: [
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.test.js",
        "**/*.test.jsx",
        // legacy: we need to standardise around *.test.ts
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "**/*.spec.js",
        "**/*.spec.jsx",
      ],
      plugins: ["jest"],
      extends: ["plugin:jest/recommended", "plugin:jest/style"],
      rules: {
        "no-shadow": [
          "warn",
          {
            allow: [
              "describe",
              "it",
              "jest",
              "expect",
              "beforeEach",
              "beforeAll",
              "afterEach",
              "afterAll",
            ],
          },
        ],
      },
    },
    {
      files: ["e2e/browser/**/*.playwright.ts"],
      extends: ["plugin:playwright/playwright-test"],
    },
  ],
};
