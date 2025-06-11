import inruptCfg from "@inrupt/eslint-config-base"
import next from "@next/eslint-plugin-next"


import { defineConfig } from "eslint/config";

export default defineConfig([
  inruptCfg, {
    plugins: {
      '@next/next': next,
    },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs['core-web-vitals'].rules,
    },
    files:  ["e2e/browser/test-app/"]
  },
]);
