import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import turboPlugin from "eslint-plugin-turbo";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintNestJs from "@darraghor/eslint-plugin-nestjs-typed";

/**
 * Shared ESLint configuration for NestJS applications.
 *
 * Intentionally does NOT extend baseConfig — NestJS requires type-aware
 * linting (recommendedTypeChecked) which conflicts with base's plain
 * recommended rules if both are included.
 *
 * Consumer must add tsconfigRootDir locally:
 *   { languageOptions: { parserOptions: { tsconfigRootDir: import.meta.dirname } } }
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const nestJsConfig = [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: "commonjs",
      parserOptions: {
        projectService: true,
      },
    },
  },
  // NestJS-specific rules: DI patterns, decorator correctness, DTO validation
  eslintNestJs.configs.flatRecommended,
  // Disable Swagger rules — project does not use @nestjs/swagger
  eslintNestJs.configs.flatNoSwagger,
  {
    rules: {
      // Allow `any` in NestJS — common in interceptors, pipes, guards
      "@typescript-eslint/no-explicit-any": "off",
      // Warn on unhandled promises (e.g. fire-and-forget without void)
      "@typescript-eslint/no-floating-promises": "warn",
      // Warn on passing untyped values into typed params
      "@typescript-eslint/no-unsafe-argument": "warn",
      // Enforce consistent prettier formatting across OS line endings
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  {
    ignores: ["dist/**"],
  },
];
