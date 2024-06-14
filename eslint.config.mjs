import { FlatCompat } from "@eslint/eslintrc"
import { fixupPluginRules } from "@eslint/compat"
import js from "@eslint/js"
import path from "node:path"
import { fileURLToPath } from "node:url"

import eslintConfigPrettier from "eslint-config-prettier"
import globals from "globals"
import { configs as tsConfigs } from "typescript-eslint"

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

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...noImportConfig,
  ...tsConfigs.recommended,
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
      // Typescript will manage named imports automatically
      "import/named": "off",
    },
  },
  eslintConfigPrettier,
  {
    name: "@josephmark/eslint-config:rules",
    rules: {
      "import/extensions": ["warn", "never"],
      "import/no-named-as-default": "off",
      curly: ["error", "all"],
      "no-underscore-dangle": "off",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-explicit-any": "off",
      camelcase: "off",
      "no-console": "off",
      "arrow-body-style": "off",
    },
  },
  {
    name: "@josephmark/eslint-config:global",
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
]
