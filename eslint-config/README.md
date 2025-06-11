# eslint-config-inrupt-base

ESlint config which is the base for all inrupt projects.

This ruleset is applicable to library code and applications. It should be extended with framework-specific rulesets where applicable (e.g. NextJS).

## Usage

In order to use this style configuration, you'll need to import it in your ESLint `eslint.config.js`: 

```js
import inruptCfg from "@inrupt/eslint-config-base"

import { defineConfig } from "eslint/config";

export default defineConfig([
  inruptCfg, 
  // ...
]);

```
