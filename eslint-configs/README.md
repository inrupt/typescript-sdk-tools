# eslint-configs

Eslint config which is the base for all Inrupt projects. You likely want to
import [eslint-config-inrupt-lib](./eslint-config-inrupt-lib) or
[eslint-config-inrupt-react](./eslint-config-inrupt-react).

## Usage

In order to use these eslint configurations, you will need to add the following
line to the top of your project's `.eslintrc.js` file:

```
require("@rushstack/eslint-patch/modern-module-resolution");
```

This ensures that you load the dependencies from the eslint configuration,
instead of your project. This patch is a workaround for the long-standing eslint
[issue 3458](https://github.com/eslint/eslint/issues/3458) regarding how eslint
loads modules.

## Configurations

### `@inrupt/eslint-config-lib`

Use this configuration to load all the typescript-specific rules, it builds on
top of `@inrupt/eslint-config-base`.

### `@inrupt/eslint-config-react`

Use this configuration for React projects or packages, it too builds on top of
`@inrupt/eslint-config-base`.

If you're working on a typescript project or package, you'll need additional
configuration to get typescript working:

```js
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },

  // These settings and the `plugin:import/typescript` are required until we add
  // this configuration to our @inrupt/eslint-config-lib base
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.eslint.json",
      },
    },
  },

  rules: {
    "react/jsx-filename-extension": [
      "error",
      {
        extensions: [".tsx"],
      },
    ],
  },
```

## Rules

Our general general principles are as follows:

- Use [airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base)
- Load recommended configs for common libraries: eslint, jest, typescript.
- Load Prettier config to override everything where there are conflicts.
- Enforce licensing headers
- Configure common problems (no-shadow, no-unresolved, etc)
- Load react-specific configs for react projects.
- Do very little else - as few custom rules or overrides as possible.
