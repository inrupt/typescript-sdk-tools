# @inrupt/jest-jsdom-polyfills

This package contains polyfills for Web APIs that we use from the Inrupt SDKs that don't currently exist in jsdom which is used by Jest.

## Installation

1. `npm install --save-dev @inrupt/jest-jsdom-polyfills`

## Usage:

Add the following line to your [Jest Test Setup file](https://jestjs.io/docs/configuration#setupfilesafterenv-array), usually you'll have this configured as `jest.setup.ts` or something similar.

```js
import "@inrupt/jest-jsdom-polyfills"
```

Done, the SDKs should now have everything they need to be tested via jest / jsdom.

## ESM / CJS Compatibility

The Inrupt SDKs currently rely on some modules that require ESM, in order to load those with Jest, you need to opt into using ESM and configure your environment appropriately.
