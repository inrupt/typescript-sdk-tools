// The following is only possible from Node 18 onwards
// import pkg from "./package.json" assert { type: "json" };

// Until we only support Node 18+, this should be used instead
// (see https://rollupjs.org/guide/en/#importing-packagejson)
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pkg = require("./package.json");

import typescript from "rollup-plugin-typescript2";

const external = [
  ...Object.keys(pkg.dependencies || {}),
  "@inrupt/solid-client-authn-node",
  "@inrupt/solid-client",
];

const plugins = [
  typescript({
    // Use our own version of TypeScript, rather than the one bundled with the plugin:
    typescript: require("typescript"),
    tsconfigOverride: {
      compilerOptions: {
        module: "esnext",
      },
    },
  }),
];

const rollupDefaultConfig = { external, plugins };

export default [
  {
    input: "index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
      },
      {
        file: pkg.module,
        entryFileNames: "[name].es.js",
        format: "esm",
      },
      {
        dir: "umd",
        format: "umd",
        name: "SolidAccess",
      },
    ],
    ...rollupDefaultConfig,
  },
  {
    input: ["index.ts"],
    output: {
      dir: "dist",
      entryFileNames: "[name].mjs",
      format: "esm",
      preserveModules: true,
    },
    ...rollupDefaultConfig,
  },
  {
    input: ["index.ts"],
    output: {
      dir: "dist",
      entryFileNames: "[name].d.ts",
      format: "esm",
      preserveModules: true,
    },
    ...rollupDefaultConfig,
  },
];
