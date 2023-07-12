import {objectToLabelValue} from "../../data/mapper";

export const vehiclesMapToSelectOptions = (vehicles) => {
  return  objectToLabelValue(vehicles, (vehicle)=> {
    const profile = vehicle.profile
    return `${profile?.make} ${profile?.model} (${profile?.vin})`
  })
}

export const trailerMapToSelectOptions = (trailers) => {
  return  objectToLabelValue(trailers, (trailer)=> {
    const profile = trailer.profile
    return `${profile?.make} ${profile?.model} (${profile?.vin})`
  })
}