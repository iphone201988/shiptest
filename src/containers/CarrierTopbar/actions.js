
export const TOGGLE_SWITCH = 'TOGGLE_SWITCH';

const initialState = {
  toggleState: false,
};

export const toggleReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SWITCH:
      return {
        ...state,
        toggleState: action.payload,
      };
    default:
      return state;
  }
};



