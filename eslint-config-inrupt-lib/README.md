# eslint-config-inrupt-lib
Eslint and prettier configs


## Installation

1. `npm install --save-dev eslint-config-inrupt-lib`
2. `npx install-peerdeps eslint-config-inrupt-lib`
3. Add `extends: ['inrupt-lib']` to your .eslintrc.js file.

## Rules

Exhaustive documentation forthcoming. For now, the general principles are:

* Load inrupt-base, which loads recommended configs for common libraries: eslint, jest, typescript,
  and prettier
* Do very little else- as few custom rules or overrides as possible.
* Some rules are updated to work with nextjs.
