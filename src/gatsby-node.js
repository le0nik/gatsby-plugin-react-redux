const fs = require('fs');
const path = require('path');
const os = require('os');

exports.onPreBootstrap = ({ store }, pluginOptions = {}) => {
  const program = store.getState().program;
  const { pathToCreateStoreModule } = pluginOptions;

  if (!pathToCreateStoreModule) {
    throw new Error(
      '[gatsby-plugin-react-redux]: missing required option "pathToCreateStoreModule"',
    );
  }

  // Create a proxy file that imports user's `createStore` module
  // We need it to have a static require on the client
  let module = `module.exports = require("${
    path.isAbsolute(pathToCreateStoreModule)
      ? pathToCreateStoreModule
      : path.join(program.directory, pathToCreateStoreModule)
  }")`;
  if (os.platform() === 'win32') {
    module = module.split('\\').join('\\\\');
  }

  const dir = `${__dirname}/.tmp`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFileSync(`${dir}/createStore.js`, module);
};
