import React from 'react';
import { Provider } from 'react-redux';
import serializeJavascript from 'serialize-javascript';
import createStore from './.tmp/createStore';
import { ELEMENT_ID, GLOBAL_KEY } from './constants';

const storesByPaths = new Map();

export const wrapRootElement = ({ element, pathname }) => {
  const store = createStore();
  storesByPaths.set(pathname, store);

  return <Provider store={store}>{element}</Provider>;
};

export const onRenderBody = (
  { setHeadComponents, pathname },
  pluginOptions,
) => {
  if (process.env.BUILD_STAGE !== 'build-html') {
    return;
  }

  const store = storesByPaths.get(pathname);
  if (store) {
    setHeadComponents([getScriptElement(store, pluginOptions)]);
    storesByPaths.delete(pathname);
  }
};

/**
 * @param {Object} store - redux store
 * @param {Object} pluginOptions
 * @param {Object} [pluginOptions.serialize]
 * @returns {ReactElement}
 */
function getScriptElement(store, pluginOptions) {
  const serializedState = serializeState(
    store.getState(),
    pluginOptions.serialize,
  );

  return (
    <script
      key="redux-state"
      id={ELEMENT_ID}
      dangerouslySetInnerHTML={{
        __html: `window['${GLOBAL_KEY}'] = ${serializedState}`,
      }}
    />
  );
}

const DEFAULT_SERIALIZE_OPTIONS = {
  space: 0,
  isJSON: true,
  unsafe: false,
};

/**
 * @param {Object} state
 * @param {Object} options
 * @returns {string}
 */
function serializeState(state, options) {
  return serializeJavascript(
    state,
    Object.assign({}, DEFAULT_SERIALIZE_OPTIONS, options),
  );
}
