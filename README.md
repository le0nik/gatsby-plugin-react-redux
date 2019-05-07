# gatsby-plugin-react-redux

> A [Gatsby](https://github.com/gatsbyjs/gatsby) plugin for
> [react-redux](https://github.com/reduxjs/react-redux) with
> built-in server-side rendering support.

## Install

`npm install --save gatsby-plugin-react-redux`

## What it does
- Wraps your app with redux `Provider` on both client and server
- Securely serializes store state with [serialize-javascript](https://github.com/yahoo/serialize-javascript) on the server and passes it to your `createStore` function on the client

## How to use

1. Create a module that exports a function which:
  - accepts a single argument `preloadedState`
  - creates `redux` store passing `preloadedState` as 2nd argument
  - returns created store

Example:

`./src/state/createStore.js`
```javascript
import { createStore } from 'redux';
import reducer from './reducer';

// For ES5 use `module.exports`
export default preloadedState => {
  return createStore(reducer, preloadedState);
};
```

2. Edit `./gatsby-config.js`

 ```javascript
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-react-redux`,
      options: {
        // [required] - path to module you created in step 1
        pathToCreateStoreModule: './src/state/createStore',
        // [optional] - options passed to `serialize-javascript`
        // info: https://github.com/yahoo/serialize-javascript#options
        // defaults:
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

## License

MIT
