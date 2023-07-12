

const actions = {

    GET_CARRIER: 'GET_CARRIER',
    GET_CARRIER_SUCCESS: 'GET_CARRIER_SUCCESS',

    getCurrentCarrier: () => ({ type: actions.GET_CARRIER}),
    getCarrierSuccess: (carrier) => ({
      type: actions.GET_CARRIER_SUCCESS,
      payload: carrier,
    }),
    getCarrierFail: (carrier) => ({
      type: actions.GET_CARRIER_SUCCESS,
      payload: carrier,
    }),
    addCarrier: payload => ({type: actions.ADD_CARRIER, payload: payload}),
    deleteCarrier: carrier_id => ({type: actions.DELETE_CARRIER, payload: {carrier_id}})
};

export default actions;
