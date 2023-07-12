import {SET_CURRENT_COMPANY} from "../actions/types";

export const initialState = {companyId: null, company: null }

export default (state = initialState, action) => {
	if (action.type === "setCompany") {
		return { ...state, company: action.company }
	}
	if (action.type === SET_CURRENT_COMPANY) {
		return { ...state, currentCompany: action.payload }
	}
	else if (action.type === "setCompanyId") {
		return { ...state, companyId: action.companyId}
	}
	else if (action.type === "setDomain") {
		return { ...state, domain: action.domain}
	}

	return state
}