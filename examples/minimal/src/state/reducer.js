const initialState = {
  message: 'Server says hello',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_MESSAGE':
      return {
        ...state,
        message: action.message,
      };
    default:
      return state;
  }
}
