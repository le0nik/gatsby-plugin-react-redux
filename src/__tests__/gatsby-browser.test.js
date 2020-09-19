import React from 'react';
import { DEFAULT_OPTIONS, SCRIPT_ELEMENT_ID } from '../constants';

const mockCreateStore = (storeState = {}) => {
  const mockFn = jest.fn(() => ({
    getState: () => storeState,
  }));
  jest.doMock('../.tmp/createStore', () => mockFn, { virtual: true });

  return mockFn;
};

describe('wrapRootElement', () => {
  beforeEach(() => {
    delete window[DEFAULT_OPTIONS.windowKey];
    jest.resetModules();
  });

  it('calls `createStore` function with preloaded state', () => {
    const preloadedState = { key: 'val' };
    window[DEFAULT_OPTIONS.windowKey] = preloadedState;

    const createStore = jest.fn(() => ({
      getState: () => preloadedState,
    }));
    jest.doMock('../.tmp/createStore', () => createStore, { virtual: true });

    const Provider = jest.fn();
    jest.doMock('react-redux', () => ({ Provider }));

    const element = <div>Hello</div>;
    const { wrapRootElement } = require('../gatsby-browser');
    wrapRootElement({ element });

    expect(createStore).toHaveBeenCalledTimes(1);
    expect(createStore).toHaveBeenCalledWith(preloadedState);
  });

  it('renders `Provider` component with correct props and children', () => {
    const preloadedState = { key: 'val' };
    window[DEFAULT_OPTIONS.windowKey] = preloadedState;

    const store = {
      getState: () => preloadedState,
    };
    jest.doMock('../.tmp/createStore', () => () => store, { virtual: true });

    const Provider = jest.fn();
    jest.doMock('react-redux', () => ({ Provider }));

    const { wrapRootElement } = require('../gatsby-browser');
    const element =<div>Hello</div>;
    const wrapped = wrapRootElement({ element });

    expect(wrapped.type).toBe(Provider);
    expect(wrapped.props.store).toBe(store);
    expect(wrapped.props.children).toBe(element);
  });
});

describe('onInitialClientRender', () => {
  beforeEach(() => {
    jest.resetModules();
    const element = document.getElementById(SCRIPT_ELEMENT_ID);
    if (element) document.head.removeChild(element);
  });

  const setup = ({ env, pluginOptions } = {}) => {
    process.env.BUILD_STAGE = env;
    const storeState = { redux: 'store' };

    const element = document.createElement('script');
    element.id = SCRIPT_ELEMENT_ID;
    document.head.appendChild(element);
    window[DEFAULT_OPTIONS.windowKey] = storeState;

    mockCreateStore(storeState);

    jest.doMock('react-redux', () => ({
      Provider: () => ({}),
    }));

    const { onInitialClientRender } = require('../gatsby-browser');
    onInitialClientRender(null, pluginOptions);

    return { element };
  };

  it('cleans up on client if cleanupOnClient is true', () => {
    const element = document.createElement('script');
    element.id = SCRIPT_ELEMENT_ID;
    document.head.appendChild(element);
    window[DEFAULT_OPTIONS.windowKey] = { redux: 'store' };

    const { onInitialClientRender } = require('../gatsby-browser');
    onInitialClientRender({}, { cleanupOnClient: true });

    expect(document.getElementById(SCRIPT_ELEMENT_ID)).toBe(null);
    expect(window.hasOwnProperty(DEFAULT_OPTIONS.windowKey)).toBe(false);
  });

  it('does not clean up if BUILD_STAGE is not build-javascript', () => {
    const element = document.createElement('script');
    element.id = SCRIPT_ELEMENT_ID;
    document.head.appendChild(element);
    window[DEFAULT_OPTIONS.windowKey] = { redux: 'store' };

    expect(document.getElementById(SCRIPT_ELEMENT_ID)).toBe(element);
    expect(window.hasOwnProperty(DEFAULT_OPTIONS.windowKey)).toBe(
      true,
    );
  });

  it('does not clean up if cleanupOnClient is not true', () => {
    const mocked = setup({
      env: 'build-javascript',
      pluginOptions: { cleanupOnClient: false },
    });
    expect(document.getElementById(SCRIPT_ELEMENT_ID)).toBe(mocked.element);
    expect(typeof window[DEFAULT_OPTIONS.windowKey] === 'undefined').toBe(
      false,
    );
  });
});
