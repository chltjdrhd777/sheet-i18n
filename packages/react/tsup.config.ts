import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entry: ['src/index.ts'],
  external: [
    '@sheet-i18n/exporter',
    '@sheet-i18n/react',
    '@sheet-i18n/typescript-config',
  ],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
});
