# @inrupt/base-rollup-config

This package contains the base configuration for rollup across our packages

## Installation

1. `npm install --save-dev @inrupt/base-rollup-config`

## Usage:

Can be used in rollup.config.mjs as follows:

```mjs
import { createRequire } from "node:module";
import createConfig from "@inrupt/base-rollup-config";
const require = createRequire(import.meta.url);

export default createConfig(require("./package.json"));
```

Make sure to specify `main` (cjs), `module` (esm) and `types` entrypoints in the package.json as rollup uses
these entries to determine where to write the output.
