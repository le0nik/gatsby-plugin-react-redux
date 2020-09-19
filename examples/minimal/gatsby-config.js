module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-react-redux',
      options: {
        pathToCreateStoreModule: './src/state/createStore',
        cleanupOnClient: false,
        serialize: {
          isJSON: false,
        },
      },
    },
  ],
};
