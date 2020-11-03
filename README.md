# javascript-style-configs

Eslint config which is the base for all Inrupt projects. You likely want to import
[eslint-config-inrupt-lib](./eslint-config-inrupt-lib) or
[eslint-config-inrupt-react](./eslint-config-inrupt-react).

## Rules

Exhaustive documentation forthcoming. For now, the general principles are:

* Load a stylistic base set - in this case,
  [airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base).
* Load recommended configs for common libraries: eslint, jest, typescript.
* Load Prettier config to override everything where there are conflicts.
* Do very little else - as few custom rules or overrides as possible.
