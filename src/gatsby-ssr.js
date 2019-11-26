import React from 'react';
import { Provider } from 'react-redux';
import serializeJavascript from 'serialize-javascript';
import createStore from './.tmp/createStore';
import { DEFAULT_OPTIONS, SCRIPT_ELEMENT_ID } from './constants';

const storesByPaths = new Map();

export const wrapRootElement = ({ element, pathname }) => {
  const store = createStore();
  storesByPaths.set(pathname, store);

  return <Provider store={store}>{element}</Provider>;
};

export const onRenderBody = (
  { setHeadComponents, pathname },
  pluginOptions = {},
) => {
  if (process.env.BUILD_STAGE !== 'build-html') {
    return;
  }

  const store = storesByPaths.get(pathname);
  if (!store) return;

  const options = { ...DEFAULT_OPTIONS, ...pluginOptions };

  const serializedState = serializeJavascript(
    store.getState(),
    options.serialize,
  ).replace(/'/g, "\\'"); // escape single quotes inside because we wrap it in them

  const parseFn = options.serialize.isJSON ? 'JSON.parse' : 'eval';

  setHeadComponents([
    <script
      key="redux-state"
      id={SCRIPT_ELEMENT_ID}
      dangerouslySetInnerHTML={{
        __html: `window['${options.windowKey}'] = ${parseFn}('${serializedState}')`,
      }}
    />,
  ]);
  storesByPaths.delete(pathname);
};
