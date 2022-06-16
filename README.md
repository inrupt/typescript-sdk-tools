# javascript-style-configs

Eslint config which is the base for all Inrupt projects. You likely want to
import [eslint-config-inrupt-lib](./eslint-config-inrupt-lib) or
[eslint-config-inrupt-react](./eslint-config-inrupt-react).

## Usage

In order to use these style configurations, you'll need to add the following
line to the top of the `.eslintrc.js` file:

```
require("@rushstack/eslint-patch/modern-module-resolution");
```

This ensures that you load the dependencies from the style configuration,
instead of your project. This patch is a workaround for the longstanding eslint
[issue 3458](https://github.com/eslint/eslint/issues/3458) regarding how eslint
loads modules.

## Rules

Exhaustive documentation forthcoming. For now, the general principles are:

- Load a stylistic base set - in this case,
  [airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base).
- Load recommended configs for common libraries: eslint, jest, typescript.
- Load Prettier config to override everything where there are conflicts.
- Do very little else - as few custom rules or overrides as possible.
