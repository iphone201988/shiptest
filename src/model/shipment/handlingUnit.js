export var LenghtUnits = {'in': 'units.length.in', 'cm': 'units.length.cm'}
export var WeightUnits = {'lbs': 'units.weight.lbs', 'kg': 'units.length.kg'}

var nanoid = require('nanoid');

export default class HandleUnit{

  constructor(data, options={}){
    data = data || {}
    this.id = data.id || nanoid(5)
    if (!options.compact ){
      this.length = data.length || 0
      this.width = data.width || 0
      this.height = data.height || 0
      this.weight = data.weight || 0
      this.quantity = data.quantity || 0
      this.packaging_type = data.packaging_type || null
      this.hazardous = data.hazardous || false
      this.stackable = data.stackable || false
      this.freight_class = data.freight_class || null
      this.unit_volume =  (this.width * this.length * this.height)/1000000
      this.total_volume = this.unit_volume * this.quantity
      this.total_weight = this.quantity * this.weight
      this.origin_location = data.origin_location
      this.destination_location = data.destination_location
    }


  }

  addOriginLocation = () => {

  }


  getWeight = () => {
    try{
      return this.quantity * this.weight
    }catch(e) {
      return 0
    }
  }

}

export function handlingUnitsTotalWeight(handlingUnits){
  return handlingUnits.reduce((total, hu)=> total + hu.getWeight(), 0)
}
