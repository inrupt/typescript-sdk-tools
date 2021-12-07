# eslint-config-inrupt-react
Eslint and prettier configs


## Installation

If Node <= 14:

1. `npm install --save-dev @inrupt/eslint-config-base`
2. `npm install --save-dev @inrupt/eslint-config-react`
3. `npx install-peerdeps @inrupt/eslint-config-react`
4. `npx install-peerdeps @inrupt/eslint-config-base`
5. Add `extends: ['@inrupt/eslint-config-react']` to your .eslintrc.js file.

If Node >= 16:

1. `npm install --save-dev @inrupt/eslint-config-base`
2. `npm install --save-dev @inrupt/eslint-config-react`
1. Run the following scripts, adjusting version where necessary:

```
(
  export PKG=@inrupt/eslint-config-base;
  export VER=latest;
  npm info "$PKG@VER" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "$PKG@VER"
)
```

```
(
  export PKG=@inrupt/eslint-config-react;
  export VER=latest;
  npm info "$PKG@VER" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "$PKG@VER"
)
```

Then, add `extends: ['@inrupt/eslint-config-lib']` to your .eslintrc.js file.


## Rules

Exhaustive documentation forthcoming. For now, the general principles are:

* Load a stylistic base set - in this case,
  [airbnb](https://www.npmjs.com/package/eslint-config-airbnb) and 
  [airbnb/hooks](https://www.npmjs.com/package/eslint-config-airbnb-hooks)
* Load inrupt-base, which loads recommended configs for common libraries: eslint, jest, typescript,
  and prettier
* Do very little else- as few custom rules or overrides as possible.
* Some rules are updated to work with nextjs.
