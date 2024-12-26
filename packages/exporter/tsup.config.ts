import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  external: ['@sheet-i18n/shared-utils', '@sheet-i18n/errors'],
  dts: true,
});
