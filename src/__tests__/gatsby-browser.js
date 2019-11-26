import React from 'react';
import { DEFAULT_OPTIONS, SCRIPT_ELEMENT_ID } from '../constants';

const mockCreateStore = (storeState = {}) => {
  const mockFn = jest.fn(() => ({
    getState: () => storeState,
  }));
  jest.doMock('../.tmp/createStore', () => mockFn, { virtual: true });

  return mockFn;
};

describe('onInitialClientRender', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    delete process.env.BUILD_STAGE;
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

  it('cleans up on client if cleanupOnClient is true and BUILD_STAGE is build-javascript', () => {
    setup({ env: 'build-javascript' });
    expect(document.getElementById(SCRIPT_ELEMENT_ID)).toBe(null);
    expect(typeof window[DEFAULT_OPTIONS.windowKey] === 'undefined').toBe(true);
  });

  it('does not clean up if BUILD_STAGE is not build-javascript', () => {
    const mocked = setup({ env: 'develop' });
    expect(document.getElementById(SCRIPT_ELEMENT_ID)).toBe(mocked.element);
    expect(typeof window[DEFAULT_OPTIONS.windowKey] === 'undefined').toBe(
      false,
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

describe('wrapRootElement', () => {
  beforeEach(() => {
    delete window[DEFAULT_OPTIONS.windowKey];
    jest.resetModules();
  });

  afterAll(() => {
    delete window[DEFAULT_OPTIONS.windowKey];
  });

  const setup = preloadedState => {
    window[DEFAULT_OPTIONS.windowKey] = preloadedState;

    const createStore = mockCreateStore(preloadedState);

    const Provider = jest.fn();
    jest.doMock('react-redux', () => ({ Provider }));

    const children = <div>Hello</div>;

    const { wrapRootElement } = require('../gatsby-browser');
    const result = wrapRootElement({ element: children });

    return {
      result,
      children,
      Provider,
      createStore,
    };
  };

  it('calls `createStore` function with preloaded state', () => {
    const preloadedState = { key: 'val' };
    const mocked = setup(preloadedState);

    expect(mocked.createStore).toHaveBeenCalledTimes(1);
    expect(mocked.createStore).toHaveBeenCalledWith(preloadedState);
  });

  it('renders `Provider` component with correct props and children', () => {
    const preloadedState = { key: 'val' };
    const mocked = setup(preloadedState);
    const store = mocked.createStore.mock.results[0].value;

    expect(mocked.result.type).toBe(mocked.Provider);
    expect(mocked.result.props.store).toBe(store);
    expect(mocked.result.props.children).toBe(mocked.children);
  });
});
