import React from 'react';
import { ELEMENT_ID, GLOBAL_KEY } from '../constants';

const mockCreateStore = (storeState = {}) => {
  const mockFn = jest.fn(() => ({
    getState: () => storeState,
  }));
  jest.doMock('../.tmp/createStore', () => mockFn, { virtual: true });

  return mockFn;
};

describe('onInitialClientRender', () => {
  const originalGetElementById = document.getElementById;
  const restoreDocument = () => {
    Object.defineProperty(document, 'getElementById', {
      value: originalGetElementById,
      writable: true,
    });
  };

  beforeEach(() => {
    jest.resetModules();
  });

  afterAll(() => {
    delete process.env.BUILD_STAGE;
    restoreDocument();
  });

  const setup = ({ env = 'build-javascript' } = {}) => {
    process.env.BUILD_STAGE = env;

    mockCreateStore({ redux: 'store' });

    const element = {
      parentNode: {
        removeChild: jest.fn(),
      },
    };
    const getElementById = jest.fn(() => element);

    jest.doMock('react-redux', () => ({
      Provider: () => ({}),
    }));

    Object.defineProperty(document, 'getElementById', {
      value: getElementById,
      writable: true,
    });

    const { onInitialClientRender } = require('../gatsby-browser');
    onInitialClientRender();

    return {
      element,
      getElementById,
    };
  };

  it('removes dom element with serialized redux state', () => {
    const mocked = setup();

    expect(mocked.getElementById).toHaveBeenCalledWith(ELEMENT_ID);
    expect(mocked.element.parentNode.removeChild).toHaveBeenCalledWith(
      mocked.element,
    );
  });

  it('only removes element when BUILD_STAGE is build-javascript', () => {
    const mocked = setup({ env: 'develop' });

    expect(mocked.getElementById).not.toHaveBeenCalled();
    expect(mocked.element.parentNode.removeChild).not.toHaveBeenCalled();
  });
});

describe('wrapRootElement', () => {
  beforeEach(() => {
    delete window[GLOBAL_KEY];
    jest.resetModules();
  });

  afterAll(() => {
    delete window[GLOBAL_KEY];
  });

  const setup = preloadedState => {
    window[GLOBAL_KEY] = preloadedState;

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
