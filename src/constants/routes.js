
export const SITE_ROUTES = {
  home: "/",
  about: "/about",
  contactUs: "/contact_us",
  404: "/404",
  500: "/500"
}

export const ADMIN_ROUTES = {
  app: "/admin",
  new_billing_profile: "new_billing_profile",
}

export const CARRIER_ROUTES = {
  app: "/carrier",
  profile: "profile",
  users: "users",
  new_user: "new_user",
  vehicles: "vehicles",
  new_vehicle: "new_vehicle",
  integrations: "integrations",
}

export const SHIPPING_ROUTES = {
  app: "/shipping",
  profile: "profile",
  new_quote: "new_quote",
  quotes: "quotes",
  quote_requests: "quote_requests",
  quote_offers: "quote_offers",
  new_billing_profile: "new_billing_profile",
}

export const WEB_ROUTES = {
  app: "/en_ca",
  fr_ca_app: "/fr_ca",
  shippers: "shippers",
  carriers: "carriers",
  about: "about",
  contact: "contact",
  // setPassword: "set_password",
  // services: "services",
  carrierSignup: "carrier_signup",
  shipperSignup: "shipper_signup",
  adminSignup: "admin_signup",
  carrierSignin: "carrier_signin",
  shipperSignin: "shipper_signin",
  adminSignin: "admin_signin",
  shipperForgotPassword: "shipper_forgot_password",
  shipperResetPassword: "shipper_reset_password",
  shipperVerifyEmail: "shipper_verify_email",
  carrierForgotPassword: "carrier_forgot_password",
  carrierResetPassword: "carrier_reset_password",
  carrierVerifyEmail: "carrier_verify_email",
  adminForgotPassword: "admin_forgot_password",
  adminResetPassword: "admin_reset_password",
  adminVerifyEmail: "admin_verify_email",
}

export function get_route_path(app, key, locate='en_ca'){

  let app_routes = {}
  
  switch(app) {
    case "web":
      app_routes = WEB_ROUTES
      break;
    case "carrier":
      app_routes = CARRIER_ROUTES
      break;
    case "shipping":
      app_routes = SHIPPING_ROUTES
      break;
    case "admin":
      app_routes = ADMIN_ROUTES
      break;
    default:
      app_routes = WEB_ROUTES
      break;
  }

  let app_path = (!locate || locate === 'en_ca') ? app_routes["app"] : app_routes[`${locate}_app`]
  let key_path = ""

  if (key === "app"){
    key_path = ""
  }else{
    if (key in app_routes){
      key_path = app_routes[key]
      
    }else{
      key_path = ""
    }

  }

  let path = `${app_path}/${key_path}`
 

  return path
}