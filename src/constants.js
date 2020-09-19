export const SCRIPT_ELEMENT_ID = 'redux-ssr';

export const DEFAULT_OPTIONS = {
  serialize: {
    space: 0,
    isJSON: true,
    unsafe: false,
    ignoreFunction: true,
  },
  cleanupOnClient: true,
  windowKey: '__PRELOADED_STATE__',
};