import {ValueOrDefault} from "helpers/data/mapper";

export const dateFormat = "MMM Do YYYY";
export const dateTimeFormat = "MMM Do YYYY HH:mm";
export const timeFormat = "HH:mm";

export const TYPE_UPDATE_QUOTE_REQUEST = "update_quote_request"
export const TYPE_CREATE_QUOTE_OFFER = "create_quote_offer"

export const DEFAULT_WEIGHT_UNIT = 'lbs'

export const DEFAULT_OPTION = {
    name: "unknown",
    default_name:  "unknown"
}

export function getOptionOrDefault(Options, key, default_value){
    const option = Options[key]
    if (option){
        return option
    }else{
        return DEFAULT_OPTION
    }
}