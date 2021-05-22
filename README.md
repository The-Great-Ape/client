# client

## Instructions for dev mode

1. Clone repo
1. Install with `npm i`
1. Start in dev mode with `npm run dev`.
1. This will use the development package `concurrently` to run the front end and back end simultaneously. Theu run on different ports and proxied using `package.json`.
1. Add the token query string parameter to the url e.g. `https://localhost:3000/?token=10000`.
1. Connect Sollet wallet and Sign Transaction.'

## Generating a build

1. Generate a build with `npm run build`.
1. Use `npm start` to run in production mode.
1. Production mode doesn't use `concurrently` because only the server is running and it serves the production built React app from the `/build` folder.
1. Go to port 500 instead: `https://localhost:3000/?token=10000`.