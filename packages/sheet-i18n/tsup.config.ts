import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entry: [
    'src/index.ts',
    'src/react/index.ts',
    'src/exporter/index.ts',
    'src/cli/index.ts',
  ],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
});
