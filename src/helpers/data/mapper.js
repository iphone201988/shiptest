
const uuidv1 = require('uuid/v1');

export function objectToKeyValList(obj) {
  return Object.keys(obj).map(key => {return {key: key, value: obj[key]}})
}

export function objectToLabelValue(obj, labelMapper=undefined) {
  return Object.keys(obj).map(key => {
    // let label = intl ? intl.formatMessage({id: obj[key].name || ""}) : obj[key]
    return {label: labelMapper != undefined ? labelMapper(obj[key]): obj[key], value: key}
  })
}

export function optionObjectToOptionsLabelValue(obj, intl=undefined) {
  return Object.keys(obj).map(key => {
    const label = intl ? intl.formatMessage({id: obj[key].name || ""}) : obj[key].name
    return {label: label, value: key}
  })
}

export function KeyValtoObject(keyVals, key_field="key", value_field="value"){
  /*
    Takes a list of {key:..., value:...}  and convert it to object {key: value}
   */
  const obj = {}
  keyVals.forEach(keyval =>{
    obj[keyval[key_field]] = keyval[value_field]
  })
  return obj
}

export function ElementListToDict(elements) {
  let Elements = {}
  for (let key in elements) {
    Elements[uuidv1()] = elements[key]
  }
  return Elements
}



export function toTableList(elements){
  (elements || []).forEach((element, ix) =>{
    element.key = ix
  })
  return elements
}



export function FilterDict(Dic, allowed=[]){
  
  return Object.keys(Dic)
    .filter(key => allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = Dic[key];
      return obj;
    }, {});

}

export function ValueOrDefault(dict, key, defaulValue=""){
  return dict[key] ? key : defaulValue
}
