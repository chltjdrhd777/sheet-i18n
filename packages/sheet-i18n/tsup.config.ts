import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entry: ['src/index.ts', 'src/exporter/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
});
