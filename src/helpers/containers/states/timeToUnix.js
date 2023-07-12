import moment from "moment";

export const earliestTimeToUnix = (value) => {
    let earliest_time = undefined
    try{earliest_time = value[0].unix()}catch (e) {}
    return earliest_time
}

export const latestTimeToUnix = (value) => {
    let latest_time = undefined
    try{latest_time = value[1].unix()}catch (e) {}
    return latest_time
}


