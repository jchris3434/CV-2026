import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url'

function cssModulesMock(): Plugin {
  return {
    name: 'css-modules-mock',
    resolveId(id) {
      if (id.endsWith('.css')) return '\0css-mock'
    },
    load(id) {
      if (id === '\0css-mock')
        return 'export default new Proxy({}, { get: (_, key) => key })'
    },
  }
}

export default defineConfig({
  plugins: [cssModulesMock(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['app/**/*.{ts,tsx}'],
      exclude: ['app/**/layout.tsx', 'app/**/page.tsx'],
    },
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./', import.meta.url)),
      },
    ],
  },
})
