import React from 'react';
import { Provider } from 'react-redux';
import createStore from './.tmp/createStore';
import { DEFAULT_OPTIONS, SCRIPT_ELEMENT_ID } from './constants';

export const wrapRootElement = ({ element }, pluginOptions = {}) => {
  const options = { ...DEFAULT_OPTIONS, ...pluginOptions };
  const preloadedState = window[options.windowKey];
  const store = createStore(preloadedState);

  return <Provider store={store}>{element}</Provider>;
};

export const onInitialClientRender = (_, pluginOptions = {}) => {
  const options = { ...DEFAULT_OPTIONS, ...pluginOptions };

  if (process.env.BUILD_STAGE !== 'build-javascript') return;
  if (!options.cleanupOnClient) return;

  delete window[options.windowKey];

  const preloadedStateEl = document.getElementById(SCRIPT_ELEMENT_ID);
  if (preloadedStateEl) {
    preloadedStateEl.parentNode.removeChild(preloadedStateEl);
  }
};
