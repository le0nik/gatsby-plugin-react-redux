# gatsby-plugin-react-redux

> A [Gatsby](https://github.com/gatsbyjs/gatsby) plugin for
> [react-redux](https://github.com/reduxjs/react-redux) with
> built-in server-side rendering support.

## Install

`npm install --save gatsby-plugin-react-redux react-redux redux`

## How to use

`./gatsby-config.js`
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
        // will be merged with these defaults:
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

`./src/state/createStore.js` // same path you provided in gatsby-config
```javascript
import { createStore } from 'redux';

function reducer() {
  //...
}

// preloadedState will be passed to you by the plugin
export default preloadedState => {
  return createStore(reducer, preloadedState);
};
```

## License

MIT
