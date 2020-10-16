# eslint-config-inrupt-lib
Eslint and prettier configs


## Installation

1. `npm install --save-dev @inrupt/eslint-config-lib`
2. `npx install-peerdeps @inrupt/eslint-config-lib`
3. `npx install-peerdeps @inrupt/eslint-config-lib`
4. Add `extends: ['@inrupt/eslint-config-lib']` to your .eslintrc.js file.

## Rules

Exhaustive documentation forthcoming. For now, the general principles are:

* Load inrupt-base, which loads recommended configs for common libraries: eslint, jest, typescript,
  and prettier
* Do very little else- as few custom rules or overrides as possible.
* Some rules are updated to work with nextjs.
