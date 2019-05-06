import React from 'react';
import { Provider } from 'react-redux';
import createStore from './.tmp/createStore';
import { ELEMENT_ID, GLOBAL_KEY } from './constants';

export const onInitialClientRender = () => {
  if (process.env.BUILD_STAGE === `develop`) {
    return;
  }

  // Remove the server-side injected state.
  const preloadedStateEl = document.getElementById(ELEMENT_ID);
  if (preloadedStateEl) {
    preloadedStateEl.parentNode.removeChild(preloadedStateEl);
  }
};

export const wrapRootElement = ({ element }) => {
  const store = createStore(window[GLOBAL_KEY]);

  return <Provider store={store}>{element}</Provider>;
};
