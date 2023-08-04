require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: ["@inrupt/eslint-config-lib"],
  rules: {
    "import/prefer-default-export": "off"
  }
}
