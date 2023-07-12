
export  class Tax {
  constructor(data, subtotal=0) {
    data = data || {}
    this.name = data.name
    this.rate = data.rate
    this.amount = data.rate * subtotal
  }
}

export class RateItem {
  constructor(data) {
    this.name = data.name || ""
    this.description = data.description || ""
    this.rate = Number(data.rate || 0)
    this.quantity = data.quantity || 1
    this.subtotal = this.rate * this.quantity
    this.taxes = (this.taxes || []).map(tax => new Tax(tax, this.subtotal ))
    this.taxes_amount = this.taxes.length > 0 ? this.taxes.map(tax => tax.amount || 0).reduce((a, b) => a + b): 0
    this.total = this.subtotal + this.taxes_amount
  }
}

export default class Rate {
  constructor(data={}) {
    this.currency_code = data.currency_code || ""
    this.rate_items = (data.rate_items || []).map(rate_item => new RateItem(rate_item))
    if (this.rate_items.length > 0){
      this.subtotal = this.rate_items.map(rate_item => rate_item.subtotal).reduce((a, b)=> a + b)
      this.taxes_amount = this.rate_items.map(rate_item => rate_item.taxes_amount).reduce((a, b)=> a + b)
      this.total = this.subtotal + this.taxes_amount
    }else{
      this.subtotal = 0
      this.taxes_amount = 0
      this.total = 0
    }
  }
}
