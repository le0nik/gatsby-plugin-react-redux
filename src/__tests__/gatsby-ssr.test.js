import React from 'react';
import { DEFAULT_OPTIONS, SCRIPT_ELEMENT_ID } from '../constants';

describe('gatsby-ssr', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.dontMock('../.tmp/createStore');
  });

  it('renders root element wrapped in redux provider', () => {
    jest.doMock('react-redux', () => ({
      Provider: jest.fn(),
    }));
    const store = {
      getState: () => ({}),
    };
    jest.doMock('../.tmp/createStore', () => () => store, { virtual: true });

    const { wrapRootElement } = require('../gatsby-ssr');
    const element = <div />;
    const wrapper = wrapRootElement({
      element,
      pathname: '/',
    });

    expect(wrapper.type).toBe(require('react-redux').Provider);
    expect(wrapper.props.store).toBe(store);
    expect(wrapper.props.children).toBe(element);
  });

  it('by default wraps serialized state with JSON.parse', () => {
    const state = { a: 'a', b: 1 };
    const store = {
      getState: () => state,
    };
    jest.doMock('../.tmp/createStore', () => () => store, { virtual: true });

    const element = <div />;
    const pathname = '/';

    const { wrapRootElement, onRenderBody } = require('../gatsby-ssr');
    wrapRootElement({ element, pathname });

    const setHeadComponents = jest.fn();
    onRenderBody({ setHeadComponents, pathname });

    expect(setHeadComponents).toHaveBeenCalledWith([
      expect.objectContaining({
        type: 'script',
        props: expect.objectContaining({
          id: SCRIPT_ELEMENT_ID,
          dangerouslySetInnerHTML: expect.objectContaining({
            __html: expect.stringContaining(
              `window['${
                DEFAULT_OPTIONS.windowKey
              }'] = JSON.parse('${JSON.stringify(state)}')`,
            ),
          }),
        }),
      }),
    ]);
  });

  it('passes options.serialize to serialize-javascript', () => {
    const state = { a: 'a' };
    const store = {
      getState: () => state,
    };
    jest.doMock('../.tmp/createStore', () => () => store, { virtual: true });

    const serializeJavascript = jest.fn(() => '{}');
    jest.doMock('serialize-javascript', () => ({
      __esModule: true,
      default: serializeJavascript,
    }));

    const element = <div />;
    const pathname = '/';

    const { wrapRootElement, onRenderBody } = require('../gatsby-ssr');
    wrapRootElement({ element, pathname });

    onRenderBody(
      {
        setHeadComponents: () => {},
        pathname,
      },
      {
        serialize: {
          space: 2,
        },
      },
    );

    expect(serializeJavascript).toHaveBeenCalledWith(
      expect.objectContaining(state),
      expect.objectContaining({ space: 2 }),
    );

    jest.dontMock('serialize-javascript');
  });

  it('if options.serialize.isJSON === false wraps serialized state with Function', () => {
    const state = { a: 'a', b: 1 };
    const store = {
      getState: () => state,
    };
    jest.doMock('../.tmp/createStore', () => () => store, { virtual: true });

    const pathname = '/';

    const { wrapRootElement, onRenderBody } = require('../gatsby-ssr');
    wrapRootElement({ element: <div />, pathname });

    const setHeadComponents = jest.fn();
    onRenderBody(
      { setHeadComponents, pathname },
      {
        serialize: {
          isJSON: false,
        },
      },
    );

    expect(setHeadComponents).toHaveBeenCalledWith([
      expect.objectContaining({
        type: 'script',
        props: expect.objectContaining({
          id: SCRIPT_ELEMENT_ID,
          dangerouslySetInnerHTML: expect.objectContaining({
            __html: expect.stringContaining(
              `window['${
                DEFAULT_OPTIONS.windowKey
              }'] = eval('(${JSON.stringify(state)})')`,
            ),
          }),
        }),
      }),
    ]);
  });

  it('respects options.windowKey', () => {
    const state = { a: 'a', b: 1 };
    const store = {
      getState: () => state,
    };
    jest.doMock('../.tmp/createStore', () => () => store, { virtual: true });

    const pathname = '/';

    const { wrapRootElement, onRenderBody } = require('../gatsby-ssr');
    wrapRootElement({ element: <div />, pathname });

    const setHeadComponents = jest.fn();
    onRenderBody(
      { setHeadComponents, pathname },
      {
        windowKey: 'otherKey',
      },
    );

    expect(setHeadComponents).toHaveBeenCalledWith([
      expect.objectContaining({
        type: 'script',
        props: expect.objectContaining({
          id: SCRIPT_ELEMENT_ID,
          dangerouslySetInnerHTML: expect.objectContaining({
            __html: expect.stringContaining(
              `window['otherKey'] = JSON.parse('${JSON.stringify(state)}')`,
            ),
          }),
        }),
      }),
    ]);
  });
});
