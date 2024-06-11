import { FlatCompat } from "@eslint/eslintrc"
import { fixupPluginRules } from "@eslint/compat"
import js from "@eslint/js"
import path from "node:path"
import { fileURLToPath } from "node:url"

import eslintConfigPrettier from "eslint-config-prettier"
import globals from "globals"
import tseslint from "typescript-eslint"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

const baseConfig = compat.extends("airbnb-base")

const importConfig = baseConfig.find(({ plugins }) => !!plugins?.import)
const noImportConfig = baseConfig.filter(({ plugins }) => !plugins?.import)

export default [
  ...noImportConfig,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  // https://github.com/import-js/eslint-plugin-import/issues/2948#issuecomment-2148832701
  {
    name: "@josephmark/eslint-config:import",
    plugins: { import: fixupPluginRules(compat.plugins("eslint-plugin-import")[0]?.plugins?.import) },
    settings: {
      "import/parsers": {
        espree: [".js", ".jsx", ".mjs", ".cjs"],
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      ...importConfig.rules,
    },
  },
  {
    name: "@josephmark/eslint-config:jm",
    rules: {
      "import/extensions": ["warn", "never"],
      "import/no-named-as-default": "off",
      curly: ["error", "all"],
      "no-underscore-dangle": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-shadow": "error",
      camelcase: "off",
      "no-console": "off",
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
]
