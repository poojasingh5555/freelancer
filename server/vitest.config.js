import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [], // Agar zaroori ho toh yahan add kar sakte hain
    testTimeout: 30000,
  },
})
