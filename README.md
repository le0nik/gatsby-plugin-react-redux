# gatsby-plugin-react-redux

> A [Gatsby](https://github.com/gatsbyjs/gatsby) plugin for
> [react-redux](https://github.com/reduxjs/react-redux) with
> built-in server-side rendering support.

## Install

`npm install --save gatsby-plugin-react-redux`

## What it does
- Wraps your app with redux `Provider` on both client and server
- Securely serializes store state on the server and passes it to your `createStore` function on the client

## How to use

Edit `gatsby-config.js`

```javascript
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-react-redux`,
      options: {
        // required
        pathToCreateStoreModule: './src/state/createStore',
        // optional, passed to `serialize-javascript`
        // info: https://github.com/yahoo/serialize-javascript#options
        serialize: {
          space: 0,
          isJSON: true,
          unsafe: false,
        },
      },
    },
  ],
};
```

Your `createStore` function will be called with a single argument - `preloadedState`:  

Example: 

```javascript
import { createStore } from 'redux';
import reducer from './reducer';

export default preloadedState => {
  return createStore(reducer, preloadedState);
};
```

## License

MIT
