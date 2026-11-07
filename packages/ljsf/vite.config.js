import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      formats: ['es'],
      fileName: 'ljsf',
    },
    sourcemap: true,
  },
  test: {
    environment: 'happy-dom',
    include: ['test/**/*.test.js'],
  },
})
