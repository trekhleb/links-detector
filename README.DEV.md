# Links Detector: Engineering Notes

## Working with the repository

#### Installation

`yarn install`

#### Running locally over `http`

`yarn start`

The app will be available at [http://localhost:3000/links-detector/](http://localhost:3000/links-detector/)

#### Running locally over `https`

It might be needed to get a camera access while testing the app on mobile devices through a local network.

`yarn start-https`

The app will be available at [https://localhost:3000/links-detector/](http://localhost:3000/links-detector/). You may also access it through the mobile device at `https://<your.local.ip.here>/links/detector` if it is on the same network.

#### Running the production build

Service workers and [PWA](https://web.dev/progressive-web-apps/) (Progressive Web App) features might be tested against production builds only. To build production version of the app and serve it, run:

`yarn start-prod`

The app will be available at [http://localhost:4000/links-detector/](http://localhost:4000/links-detector/)

## Version locks

`react-router-dom v5.X.X` isn't compatible with `history v5.X.X`.
Therefore `package.json` locked `history` package version to `v4.X.X`. See [StackOverflow question](https://stackoverflow.com/questions/62449663/react-router-with-custom-history-not-working) for more details.
