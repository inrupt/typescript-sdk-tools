import { createSharedConfig } from "@inrupt/base-rollup-config";
import pkg from "./package.json" assert { type: "json" };

export default [
  {
    ...createSharedConfig(pkg),
    input: "src/index.ts",
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
        dir: "dist",
        entryFileNames: "[name].mjs",
        format: "esm",
        preserveModules: true,
      }
    ],
  },
];
