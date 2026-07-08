const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  webServer: [
    {
      command: 'npm --prefix ../../part4 run start:test',
      url: 'http://localhost:3003/api/blogs',
      timeout: 120000,
      reuseExistingServer: false,
    },
    {
      command: 'npm --prefix ../bloglist-frontend run dev -- --host 127.0.0.1',
      url: 'http://localhost:5173',
      timeout: 120000,
      reuseExistingServer: false,
    },
  ],
  use: {
    baseURL: 'http://localhost:5173',
  },
})
