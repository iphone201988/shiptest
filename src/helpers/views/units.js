var convert = require('convert-units')

export function weight_convert(weight_kg, {show_unit=false}={}){
  //TODO: get the user weight unit setting
  let user_weight_unit = 'lbs'
  let weight= convert(weight_kg).from('kg').to(user_weight_unit)

  return show_unit ? `${weight} ${user_weight_unit}`  : weight
}

