import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  external: ['react', 'react-intl'],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
