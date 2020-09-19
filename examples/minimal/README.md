# Minimal example of `gatsby-plugin-react-redux` usage

## Install dependencies

`npm install`

## Start production server

`npm start`

## Check hydrated state in production build

Open  `./public/index.html` or go to `View Source` when the page is loaded on the server
and search for `redux-ssr`, which is `id` of injected `script` element.

It's only visible in `View Source`, not in `Inspect Element` panel because it gets removed on page load.

## License

MIT
