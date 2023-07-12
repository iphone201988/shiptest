import {FETCH_CARRIER_USERS, FETCH_ACTIVE_DRIVERS, FETCH_ACTIVE_CARRIER_USERS} from '../actions/types';

const filterDrivers = (usersPayload) => {
    const driversPayload ={}
    if (usersPayload){
        Object.values(usersPayload).filter(user => (user.role_types || []).includes("role_driver")).map(user => {
            driversPayload[user.id] = user
        })
    }
    return driversPayload

}

export default (state = {}, action) => {
    switch(action.type) {
        case FETCH_CARRIER_USERS:
            return action.payload || null;
        case FETCH_ACTIVE_CARRIER_USERS:
            return {...state, activeUsers: action.payload != undefined  ? action.payload : {},
                activeDrivers: action.payload != undefined ? filterDrivers(action.payload) : {}}
        case FETCH_ACTIVE_DRIVERS:
            return {...state, activeDrivers: action.payload != undefined  ? action.payload : {}}
        default:
            return state;
    }
};