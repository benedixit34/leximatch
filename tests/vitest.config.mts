import { defineConfig } from 'vitest/config';
import path from 'node:path';
export default defineConfig({
  esbuild: { jsx: 'automatic' },
  resolve: { alias: { '@': path.resolve(__dirname, '../src') } },
  test: { environment: 'jsdom', globals: true, root: __dirname, include: ['*.test.tsx'] },
});
