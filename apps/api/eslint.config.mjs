// @ts-check
import { nestJsConfig } from "@repo/eslint-config/nestjs";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["eslint.config.mjs"] },
  ...nestJsConfig,
  {
    // tsconfigRootDir must be set locally so the TypeScript parser resolves
    // tsconfig.json relative to this app, not the shared eslint-config package
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
