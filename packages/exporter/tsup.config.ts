import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entry: ['src/index.ts'],
  external: [
    '@sheet-i18n/errors',
    '@sheet-i18n/shared-utils',
    '@sheet-i18n/typescript-config',
  ],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
});
