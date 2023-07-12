import CoreModel from "../core/core";

export default class Event extends CoreModel{
  constructor(id = undefined, data) {
    super(id)
    try {
      this.info = data.info;
      this.company_account = data.company_account
      this.type = data.type
    } catch (e) {
      this.invalid = true
    }
  }

  isValid = () => {
    return !this.invalid
  }
}
