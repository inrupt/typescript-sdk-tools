# eslint-config-inrupt-lib

Eslint and prettier configs

## Installation

1. `npm install --save-dev @inrupt/eslint-config-lib @rushstack/eslint-patch`

## Setup (Quick start)

Create a `.eslintrc.js` in the the root of your project with the following contents:

```js
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: ["@inrupt/eslint-config-lib"],
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
  rules: {},
};
```

The file `tsconfig.eslint.json` is your typescript configuration with the e2e tests, unit tests and examples included, e.g.,

```json
{
  "extends": "./tsconfig.json",
  "include": ["src/**/*.ts", "e2e/**/*.ts", "examples/**/*.ts", "*.md"],
  "exclude": ["**/node_modules", "**/dist/**"]
}
```

## Migrating to this configuration:

1. Add `extends: ['@inrupt/eslint-config-lib']` to your `.eslintrc.js` file.
1. Add the following line to the top of the `.eslintrc.js` file:

```js
require("@rushstack/eslint-patch/modern-module-resolution");
```

## Rules

Exhaustive documentation forthcoming. For now, the general principles are:

- Load inrupt-base, which loads recommended configs for common libraries: eslint, jest, typescript,
  and prettier
- Do very little else- as few custom rules or overrides as possible.
- Some rules are updated to work with nextjs.
