# Full Stack open CI/CD

This repository is used for the CI/CD module of the Full Stack Open course

## Live application

Link to application: https://msami936-fullstackopen-part11.fly.dev

## Commands

Start by running `npm install` inside the project folder

`npm start` to run the webpack dev server
`npm test` to run tests
`npm run eslint` to run eslint
`npm run build` to make a production build
`npm run start-prod` to run your production build
`npm run test:e2e` to run Playwright end-to-end tests

## Deployment

From the `part11` directory:

```bash
fly auth login
fly launch --no-deploy
fly deploy
```

The app configuration is in `fly.toml` and `Dockerfile`.
