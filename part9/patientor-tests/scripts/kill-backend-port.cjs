const { execSync } = require('node:child_process');

if (process.env.CI) {
  process.exit(0);
}

execSync('npx --yes kill-port 3001', { stdio: 'inherit' });
