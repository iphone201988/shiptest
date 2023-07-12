export const initialState = {active_request: "" }

export default function reducer(state = initialState, action) {
	if (action.type === "setActiveRequest") {
		return { ...state, reset: true }
	}
	return state
}