// const VERSION = 1
const apiURL = "https://api.keeptruckin.com"
const homeURL = "https://keeptruckin.com"



export  const KTConfig = {
  apiURL: apiURL,
  homeURL: homeURL,
  version: 1,
  endpoints: {
    'users': 'users',
    'vehicles': 'vehicles',
    'eld_devices': 'eld_devices',
    'vehicles_locations': 'vehicles_locations',
    'drivers_locations': 'drivers_locations',
    'company_webhooks': 'company_webhooks',
    'authorize': 'oauth/authorize',
    'token': 'oauth/token'
  },
  scopes: "companies.read vehicles.read assets.read eld_devices.read locations.vehicle_locations_list locations.vehicle_locations_single locations.driver_locations users.read",
  // scopes: ["companies.read", "vehicles.read", "freight_visibility_vehicle_locations.read", "users.read", "eld_devices.read"],
  // scopes: ["companies.read", "freight_visibility_vehicle_locations.read", "vehicles"],
  retry: 4,
  clientId: '28d69e8b427a8255ee0c321887b6d9faa93dcbc1f9f68981f5294d04b18e80f8',
  redirectURL: 'https://shiphaul.com/carrier/integrations/keeptruckin'
}

export default KTConfig