import { parsePhoneNumberFromString } from 'libphonenumber-js'

const moment = require('moment-timezone');

export function formatPhone(number, type = "E.164"){
    try{
        return parsePhoneNumberFromString(number).format(type)
    }catch (e) {
        return ""
    }
}

export function TimeZoneToUTCOffset(timezone){
    let utcOffset = 0
    try{
        utcOffset =  parseInt(timezone.replace(/UTC/g, "").replace(/ETC/g, "").replace(/0/g, "").replace(/0/g, "")) * 60
    }catch (e) {
    }
    return utcOffset
}

export function changeDateTimeZone(datetime, utcOffset){
    const date_str = datetime.format("YYYY-MM-DD HH:mm")
    return moment(date_str).utcOffset(utcOffset, true)
}

export function getLocalTimeFromEpoch(epochTime, utcOffset=undefined, date_format=undefined){
    try{
        let local_time = utcOffset ? changeDateTimeZone(moment.unix(epochTime), utcOffset) : moment.unix(epochTime)
        if (date_format){
            try{
                local_time = local_time.format(date_format)
            }catch (e) {
                local_time = ""
            }
        }
        return local_time
    }catch (e) {
        return undefined
    }
}

export function TimeStamp(value){
    try{
        return value.seconds || Number(value)
    }catch (e) {
        return undefined
    }
  
}

export function ObjectToJSON(object){
    return JSON.parse(JSON.stringify(object))
}