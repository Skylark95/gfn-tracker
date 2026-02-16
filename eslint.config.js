import globals from "globals";
import js from "@eslint/js";
import tseslintParser from "@typescript-eslint/parser";
import tseslintPlugin from "@typescript-eslint/eslint-plugin";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier"; // This directly exports the flat config array

export default [
  {
    ignores: ["dist", "eslint.config.js", "vite.config.ts", "sw.js", "postcss.config.cjs", "tailwind.config.cjs", "node_modules"],
  },
  js.configs.recommended, // Basic JS recommended rules
  { // This block replaces tseslint.configs.recommended
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslintPlugin,
    },
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname, // Use import.meta.dirname for ESM
      },
    },
    rules: {
      ...tseslintPlugin.configs.recommended.rules, // Apply recommended rules from the plugin
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      react: reactPlugin, // Directly use the react plugin
      "react-hooks": reactHooksPlugin, // Directly use the react-hooks plugin
      "react-refresh": reactRefreshPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
    rules: {
      // React recommended rules
      ...reactPlugin.configs.recommended.rules,
      // React JSX runtime rules
      ...reactPlugin.configs["jsx-runtime"].rules,
      // React Hooks recommended rules
      ...reactHooksPlugin.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/react-in-jsx-scope": "off",
    },
  },
  // Prettier configuration (should always be last to override other formatting rules)
  prettierConfig, // Directly use the imported prettier config
];