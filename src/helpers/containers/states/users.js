import {objectToLabelValue} from "../../data/mapper";

export const usersMapToSelectOptions = (users) => {
  return objectToLabelValue(users, (user)=> {
    const profile = user.profile || {}
    return `${profile.first_name} ${profile.last_name}`
  })
}