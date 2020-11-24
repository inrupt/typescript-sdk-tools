# eslint-config-inrupt-react
Eslint and prettier configs


## Installation

1. `npm install --save-dev @inrupt/eslint-config-react`
2. `npx install-peerdeps @inrupt/eslint-config-react --dev`
3. `npx install-peerdeps @inrupt/eslint-config-base --dev`
4. Add `extends: ['@inrupt/eslint-config-react']` to your .eslintrc.js file.

## Rules

Exhaustive documentation forthcoming. For now, the general principles are:

* Load a stylistic base set - in this case,
  [airbnb](https://www.npmjs.com/package/eslint-config-airbnb) and 
  [airbnb/hooks](https://www.npmjs.com/package/eslint-config-airbnb-hooks)
* Load inrupt-base, which loads recommended configs for common libraries: eslint, jest, typescript,
  and prettier
* Do very little else- as few custom rules or overrides as possible.
* Some rules are updated to work with nextjs.
