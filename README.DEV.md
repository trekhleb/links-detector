# Links Detector: Engineering Notes

## Working with the repository

Installing dependencies:

`yarn install`

Launching the app locally over `http`:

`yarn start`

The app will be available at [http://localhost:3000/links-detector/](http://localhost:3000/links-detector/)

Launching the app in local network over `https` (it might be needed to get camera access while testing on mobile devices in a local network):

`yarn start-https`

The app will be available at [https://localhost:3000/links-detector/](http://localhost:3000/links-detector/) or for mobile devices at `https://<your.local.ip.here>/links/detector`.

Launching the production build (to test service workers and offline access):

`yarn start-prod`

The app will be available at [http://localhost:4000/links-detector/](http://localhost:4000/links-detector/)

## Version locks

`react-router-dom v5.X.X` isn't compatible with `history v5.X.X`.
Therefore `package.json` contains `history v4.X.X`.
See [StackOverflow question](https://stackoverflow.com/questions/62449663/react-router-with-custom-history-not-working) for more details.
