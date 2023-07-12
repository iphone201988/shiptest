import CarrierUser from "model/user/carrier_user"

export const initialState = {user: null, userId: null}


export default function reducer(state = initialState, action) {
    if (action.type === "setCarrierUser") {
        state.user = new CarrierUser(action.carrierUser.id, action.carrierUser)
        return state
        // return { ...state, "user": action.user }
    }
    else if (action.type === "setCarrierUserId") {
        state.userId =action.carrierUserId
        return state
    }

    return state
}