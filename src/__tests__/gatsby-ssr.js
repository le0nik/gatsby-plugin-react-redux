const mockCreateStore = (storeState = {}) => {
  const mockFn = jest.fn(() => ({
    getState: () => storeState,
  }));
  jest.doMock('../.tmp/createStore', () => mockFn, { virtual: true });

  return mockFn;
};

describe('onRenderBody', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterAll(() => {
    delete process.env.BUILD_STAGE;
  });

  const setup = ({ storeState, pluginOptions, env } = {}) => {
    process.env.BUILD_STAGE = env || 'build-html';

    mockCreateStore(storeState);

    jest.doMock('react-redux', () => ({
      Provider: () => ({}),
    }));

    const serializeJavascript = jest.fn(() => '{"key":"val"}');
    jest.doMock('serialize-javascript', () => serializeJavascript);

    const { onRenderBody, wrapRootElement } = require('../gatsby-ssr');
    wrapRootElement({ element: null, pathname: '/' });

    const api = { setHeadComponents: jest.fn(), pathname: '/' };
    onRenderBody(api, pluginOptions || {});

    return {
      api,
      serializeJavascript,
    };
  };

  it('only invokes `setHeadComponents` if BUILD_STAGE is build-html', () => {
    const mocked = setup({ env: 'build-javascript' });

    expect(mocked.api.setHeadComponents).not.toHaveBeenCalled();
  });

  it('only invokes `serializeJavascript` if BUILD_STAGE is build-html', () => {
    const mocked = setup({ env: 'build-javascript' });

    expect(mocked.serializeJavascript).not.toHaveBeenCalled();
  });

  it('invokes serializeJavascript store state and merged options', () => {
    const storeState = { store: 'state' };
    const defaultOptions = { isJSON: true };
    const userOptions = { myOption: 'myOption', isJSON: false };

    const mocked = setup({
      storeState,
      pluginOptions: {
        serialize: userOptions,
      },
    });

    expect(mocked.serializeJavascript).toHaveBeenCalledTimes(1);
    expect(mocked.serializeJavascript).toHaveBeenCalledWith(
      storeState,
      expect.objectContaining({ ...defaultOptions, ...userOptions }),
    );
  });

  it('invokes setHeadComponents script element wrapped in an array', () => {
    const mocked = setup();

    expect(mocked.api.setHeadComponents).toHaveBeenCalledTimes(1);
    expect(mocked.api.setHeadComponents).toHaveBeenCalledWith([
      expect.objectContaining({ key: 'redux-state' }),
    ]);
  });
});

describe('wrapRootElement', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  const setup = () => {
    const createStore = mockCreateStore({ redux: 'store' });

    const Provider = jest.fn();
    jest.doMock('react-redux', () => ({
      Provider,
    }));

    const createElement = jest.fn();
    jest.doMock('react', () => ({
      createElement,
    }));

    const children = { key: 'children' };

    const { wrapRootElement } = require('../gatsby-ssr');
    wrapRootElement({ element: children });

    return {
      children,
      Provider,
      createStore,
      createElement,
    };
  };

  it('calls `createStore` function', () => {
    const mocked = setup();

    expect(mocked.createStore).toHaveBeenCalledTimes(1);
  });

  it('renders `Provider` component with correct props and children', () => {
    const mocked = setup();

    const store = mocked.createStore.mock.results[0].value;
    expect(mocked.createElement).toHaveBeenCalledTimes(1);
    expect(mocked.createElement).toHaveBeenCalledWith(
      mocked.Provider,
      expect.objectContaining({ store }),
      mocked.children,
    );
  });
});
