import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'npm start',
      cwd: '../patientor/backend',
      url: 'http://localhost:3001/api/ping',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: process.env.CI
        ? 'npx vite preview --port 5173'
        : 'npm run dev -- --port 5173',
      cwd: '../patientor/frontend',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
