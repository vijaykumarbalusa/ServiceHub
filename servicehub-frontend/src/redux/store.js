import { createStore } from 'redux';

// Example reducer
const initialState = {
  value: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, value: state.value + 1 };
    case 'DECREMENT':
      return { ...state, value: state.value - 1 };
    default:
      return state;
  }
};

// Create the Redux store
const store = createStore(reducer);

export default store;