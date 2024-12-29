import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entry: ['src/index.ts'],
  external: [
    '@sheet-i18n/typescript-config',
    '@sheet-i18n/core',
    '@sheet-i18n/react',
  ],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
});
