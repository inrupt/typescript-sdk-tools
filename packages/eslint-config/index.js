// Copyright Inrupt Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
// Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";

// eslint-disable-next-line import/no-unresolved
import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import jest from "eslint-plugin-jest";
import headers from "eslint-plugin-headers";
import prettier from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
import globals from "globals";
// eslint-disable-next-line import/no-unresolved
import tseslint from "typescript-eslint";

const typedLinting = {
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-empty-function": [
      "error",
      {
        allow: ["arrowFunctions"],
      },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
      },
    ],
    "@typescript-eslint/return-await": ["error", "in-try-catch"],
  },
  // Lint imports based on TS module resolution.
  extends: [
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
  ],
  files: ["**/*.ts", "**/*.tsx"],
  // This avoids requiring a dedicated tsconfig.eslint.json file in every repo.
  ignores: [
    "**/*.test.ts",
    "**/*.mock*.ts",
    "**/jest.setup.ts",
    "**/e2e.playwright.ts",
    "**/globalSetup.ts",
  ],
};

export default defineConfig([
  prettier,
  // JS config
  {
    ...js.configs.recommended,
    files: ["**/*.js", "**/*.mjs"],
  },
  // TS config
  ...tseslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-empty-function": [
        "error",
        {
          allow: ["arrowFunctions"],
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/return-await": ["error", "in-try-catch"],
    },
    // Lint imports based on TS module resolution.
    extends: [importPlugin.flatConfigs.typescript],
    files: ["**/*.ts", "**/*.tsx"],
    // This avoids requiring a dedicated tsconfig.eslint.json file in every repo.
    ignores: [
      "**/*.test.ts",
      "**/*.mock*.ts",
      "**/jest.setup.ts",
      "**/e2e.playwright.ts",
      "**/globalSetup.ts",
    ],
  },
  // React config
  {
    plugins: {
      react,
      "react-hooks": hooks,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...hooks.configs.recommended.rules,
      "react/react-in-jsx-scope": ["off"],
    },
    settings: {
      react: {
        version: "detect", // You can add this if you get a warning about the React version when you lint
      },
    },
    files: ["**/*.jsx", "**/*.tsx"],
  },
  // Globals config
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // JSON linting
  {
    files: ["**/*.json"],
    plugins: { json },
    // Support JSON with comments (e.g. tsconfig)
    language: "json/jsonc",
  },
  // Markdown linting
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"],
  },
  // Tests linting
  {
    ...jest.configs["flat/recommended"],
    ...jest.configs["flat/style"],
    files: [
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.test.js",
      "**/*.test.jsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "**/*.spec.js",
      "**/*.spec.jsx",
    ],
    plugins: { jest },
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
      "@typescript-eslint/no-explicit-any": ["off"],
    },
  },
  // License headers config
  {
    plugins: {
      headers,
    },
    rules: {
      "headers/header-format": [
        "error",
        {
          source: "file",
          path: "LICENSE",
          style: "line",
          blockSuffix: "\n",
        },
      ],
    },
  },
  // The .next directory is generated by NextJS and should not be linted.
  globalIgnores(["**/.next/*", "**/dist/*", "**/docs/*", "**/*.d.ts"]),
]);

export const ignoreTypedLinting = (paths) => {
  paths.forEach((path) => {
    typedLinting.ignores.push(path);
  });
};
