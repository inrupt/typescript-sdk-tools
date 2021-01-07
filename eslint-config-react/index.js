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
    "airbnb",
    "airbnb/hooks",
    "@inrupt/eslint-config-base",
  ],

  plugins: [
    "react",
  ],

  parser: "babel-eslint",

  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2018,
    sourceType: "module",
  },

  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts", ".jsx", ".tsx"],
      },
    },
  },

  rules: {
    // Disable the jsx-one-expression-per-line rule, which makes it a pain to handle spaces and
    // inline elements like em
    "react/jsx-one-expression-per-line": ["off"],

    "react/jsx-filename-extension": ["warn", { extensions: [".tsx", ".jsx"] }],

    // Order the properties of react components nicely
    "react/static-property-placement": ["error", "static public field"],

    // Allow Nextjs <Link> tags to contain a href attribute
    "jsx-a11y/anchor-is-valid": ["error", {
      components: ["Link"],
      specialLink: ["hrefLeft", "hrefRight"],
      aspects: ["invalidHref", "preferButton"],
    }],

    // Make everything work with .tsx as well as .ts
    "import/extensions": ["error", {
      js: "never",
      ts: "never",
      tsx: "never",
      jsx: "never",
    }],

    "license-header/header": ["warn", "./resources/license-header.js"],

    "no-use-before-define": [1],
  },

  overrides: [{
    files: ["**/*.ts", "**/*.tsx"],
    extends: ["@inrupt/eslint-config-react"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "license-header/header": ["warn", "./resources/license-header.js"],
      "react/jsx-filename-extension": ["warn", { extensions: [".tsx", ".jsx"] }],

      // Switch to typescript's definition checker for ts files
      "no-use-before-define": ["off"],
      "@typescript-eslint/no-use-before-define": ["warn"],
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".ts", ".jsx", ".tsx"],
        },
      },
    },
  }]
};
