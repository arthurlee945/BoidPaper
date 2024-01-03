/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ["plugin:@next/next/recommended"],
  rules: {
    "no-console": 1,
    "import/no-default-export": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-floating-promises": ["warn", { ignoreIIFE: true }],
    "@next/next/no-html-link-for-pages": "off",
  },
};

module.exports = config;
