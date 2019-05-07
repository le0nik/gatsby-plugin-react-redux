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
    const state = store.getState();
    setHeadComponents([getScriptElement(state, pluginOptions.serialize)]);
    storesByPaths.delete(pathname);
  }
};

const DEFAULT_SERIALIZE_OPTIONS = {
  space: 0,
  isJSON: true,
  unsafe: false,
};

/**
 * @param {Object} state
 * @returns {ReactElement}
 */
function getScriptElement(state, serializeOptions) {
  const serializedState = serializeJavascript(
    state,
    Object.assign({}, DEFAULT_SERIALIZE_OPTIONS, serializeOptions),
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
