export const initialState = {user: null, userId: null}

export default function reducer(state = initialState, action) {
    if (action.type === "setUser") {
        state.user = action.user
        return state
    }
    else if (action.type === "setUserId") {
        state.userId =action.userId
        return state
    }
    return state
}