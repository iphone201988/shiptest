import {callFunction} from "./functions_base";

export const getStripeOnboardLink = (data) => {
  return callFunction("manageResource", {resourceType: 'payment', action: 'getStripeOnboardLink', data:data})
}

export const createPaymentCustomerAccount = () => {
  const data = {
    profile: {
      name: '123',
      description: 'test',
      email: 'x@test.com',
      phone: '514-903-2312',
      address: {address: {city: 'montreal', state: 'Quebec', postalCode: 'H4L1J8'}}
    },
    companyAccount: {
      id: 'EtZWoyDqKadOg8CqlGug',
    },
    type: 'stripe_customer'
  }

  return callFunction("manageResource", {resourceType: 'payment', action: 'createPaymentCustomerAccount', data:data})
}


// this.name = data.name ?? ""
// this.address = new GeoLocation(data.address || {})
// this.description = data.description ?? ""
// this.email = data.email ?? ""
// this.phone = data.phone ?? ""