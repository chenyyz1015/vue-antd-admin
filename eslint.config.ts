import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import globals from "globals";
import typescript from "typescript-eslint";
import eslintrcAutoImport from "./.eslintrc-auto-import.json";

export default defineConfig(
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/.husky/**", "**/.vscode/**"]
  },
  js.configs.recommended,
  typescript.configs.recommended,
  pluginVue.configs["flat/recommended"],
  prettier,
  {
    files: ["**/*.{js,ts,vue}"],
    languageOptions: {
      parserOptions: {
        parser: typescript.parser,
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: {
        ...globals.browser,
        ...eslintrcAutoImport.globals
      }
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
    }
  }
);
