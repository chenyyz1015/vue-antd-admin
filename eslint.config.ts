import js from "@eslint/js";
import typescript from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import prettier from "eslint-config-prettier";
import eslintrcAutoImport from "./.eslintrc-auto-import.json";

export default [
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/.husky/**"]
  },
  js.configs.recommended,
  ...typescript.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  prettier,
  {
    files: ["**/*.{js,ts,vue}"],
    languageOptions: {
      parserOptions: {
        parser: typescript.parser,
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
    },
    ...eslintrcAutoImport
  }
];
