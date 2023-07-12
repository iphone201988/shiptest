import {UNKNOWN_NAME} from "constants/options/general";


export function Capitalize(str, option="first_word"){

	if (str && str.length > 0){
		if ("first_word"){
			return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
		}else{
			return str.toUpperCase()
		}
	}
	return ""
}

export function IntlLabel(key, validKeys=undefined, prefix="", postfix="", default_value=UNKNOWN_NAME){

	/**
	 * Get International label for a specific Option
	 *
	 * @param OptionMap:
	 * @param key
	 * @param prefix
	 *
	 * */


	if (validKeys && !(key in validKeys)){
		return default_value
	}

	return `${prefix}.${key}.${postfix}`
}

export function removeUnderScoreWithSpace(str, option = "first_word") {

	if (str && str.length > 0) {
		return str.replace(/_/g, " ")
	}
	return ""
}

export function CapitalizeEachWord(str, option = "first_word") {

	if (str && str.length > 0) {
		return str.replace(/\b\w/g, (char) => char.toUpperCase());
	}
	return ""
}