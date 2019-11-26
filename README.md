# gatsby-plugin-react-redux

> A [Gatsby](https://github.com/gatsbyjs/gatsby) plugin for
> [react-redux](https://github.com/reduxjs/react-redux) with
> built-in server-side rendering support.

## Install

`npm install --save gatsby-plugin-react-redux react-redux redux`

## How to use

`./src/state/createStore.js` // same path you provided in gatsby-config
```javascript
import { createStore } from 'redux';

function reducer() {
  //...
}

// preloadedState will be passed in by the plugin
export default preloadedState => {
  return createStore(reducer, preloadedState);
};
```

`./gatsby-config.js`
```javascript
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-react-redux`,
      options: {
        // [required] - path to your createStore module
        pathToCreateStoreModule: './src/state/createStore',
        // [optional] - options passed to `serialize-javascript`
        // info: https://github.com/yahoo/serialize-javascript#options
        // will be merged with these defaults:
        serialize: {
          space: 0,
          isJSON: true,
          unsafe: false,
        },
        // [optional] - if true will clean up after itself on the client, default:
        cleanupOnClient: true,
        // [optional] - name of key on `window` where serialized state will be stored, default:
        windowKey: '__PRELOADED_STATE__',
      },
    },
  ],
};
```

## License

MIT
