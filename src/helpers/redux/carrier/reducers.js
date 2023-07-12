import actions from "./actions";

const initState = {
  currentCarrier: undefined,
  carrierLoaded: false,
  error: false
};

export default function CarrierReducer(state = initState,  action) {
  switch (action.type) {
    case actions.GET_CARRIER:
      return {
        ...state,
        carrierLoaded: false,
        currentCarrier: action.carrier,
      };

    case actions.GET_CARRIER_SUCCESS:
      return {
        ...state,
        carrierLoaded: true,
        currentCarrier: action.carrier,
      };

    default:
      return state;
  }
}
