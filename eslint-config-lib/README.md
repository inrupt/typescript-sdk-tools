# eslint-config-inrupt-lib
Eslint and prettier configs

## Installation

If Node <= 14:

1. `npm install --save-dev @inrupt/eslint-config-base`
1. `npm install --save-dev @inrupt/eslint-config-lib`
1. `npx install-peerdeps @inrupt/eslint-config-lib`
1. `npx install-peerdeps @inrupt/eslint-config-base`
1. Add `extends: ['@inrupt/eslint-config-lib']` to your .eslintrc.js file.

If Node >= 16:

1. `npm install --save-dev @inrupt/eslint-config-base`
1. `npm install --save-dev @inrupt/eslint-config-lib`
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
  export PKG=@inrupt/eslint-config-lib;
  export VER=latest;
  npm info "$PKG@VER" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "$PKG@VER"
)
```

Then, add `extends: ['@inrupt/eslint-config-lib']` to your .eslintrc.js file.

## Rules

Exhaustive documentation forthcoming. For now, the general principles are:

* Load inrupt-base, which loads recommended configs for common libraries: eslint, jest, typescript,
  and prettier
* Do very little else- as few custom rules or overrides as possible.
* Some rules are updated to work with nextjs.
