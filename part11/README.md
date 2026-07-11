# Full Stack open CI/CD

This repository is used for the CI/CD module of the Full Stack Open course

## Live application

Link to application: https://msami936-fullstackopen-part11.fly.dev

## My own pipeline repository

Link to repository: https://github.com/msami936/part11_exercise21

## Commands

Start by running `npm install` inside the project folder

`npm start` to run the webpack dev server
`npm test` to run tests
`npm run eslint` to run eslint
`npm run build` to make a production build
`npm run start-prod` to run your production build
`npm run test:e2e` to run Playwright end-to-end tests

## Deployment

The app exposes a health check at `/health` and is deployed automatically when the GitHub Actions pipeline passes.

From the `part11` directory:

```bash
flyctl auth login
flyctl deploy
```

Fly.io polls `/health` to verify deployments. The pipeline also checks the endpoint after deploy.

The app configuration is in `fly.toml` and `Dockerfile`.

Test PR change for branch protection verification.
