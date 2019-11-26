export const SCRIPT_ELEMENT_ID = 'redux-ssr';

export const DEFAULT_OPTIONS = {
  serialize: {
    space: 0,
    isJSON: true,
    unsafe: false,
  },
  cleanupOnClient: true,
  windowKey: '__PRELOADED_STATE__',
};