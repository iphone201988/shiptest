export class CarrierEquipment {
  constructor(equipment){
    equipment = equipment || {}
    this.id = equipment.id
    this.status = equipment.status
  }
}

