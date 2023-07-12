import {COMPANY_LOCATION_TYPES} from "constants/options/location";
const h3 = require("h3-js");

export class Address{

  constructor(addressData){
    this.houseNumber = addressData.HouseNumber || addressData.houseNumber || addressData.house || ""
    this.street = addressData.Street || addressData.street || ""
    this.postalCode = addressData.PostalCode || addressData.postalCode || ""
    this.district = addressData.District || addressData.district || ""
    this.city = addressData.City || addressData.city || ""
    this.county = addressData.County || addressData.county || ""
    this.state = addressData.State || addressData.state || ""
    this.country = addressData.Country || addressData.country || ""
    this.label = addressData.Label || addressData.label || ""
    this.shortLabel = `${this.city}, ${this.state}`
  }
}

const geopoint = (geopoint) => {
   return {longitude: geopoint.longitude || geopoint.Longitude || geopoint._lon, latitude: geopoint.latitude || geopoint.Latitude  || geopoint._lat}
}

export class Position {

  constructor(data) {
    try{
      data.geopoint = geopoint(data.geopoint || data.coordinates)
      this.geopoint = data.geopoint
      
      if (data.geopoint.latitude && data.geopoint.longitude){
        // this.geohash = data.geohash ? data.geohash : geohashEnconde(data.geopoint.latitude, data.geopoint.longitude, 7)
        // this.geohash_3 = data.geoash_3 ? data.geoash_3 : geohashEnconde(data.geopoint.latitude, data.geopoint.longitude, 3)
        // this.geoash_4 = data.geoash_4 ? data.geoash_4 : geohashEnconde(data.geopoint.latitude, data.geopoint.longitude, 4)
        const h3Index1 = h3.geoToH3(data.geopoint.latitude, data.geopoint.longitude, 1);
        const h3Index2 = h3.geoToH3(data.geopoint.latitude, data.geopoint.longitude, 2);
        const h3Index3 = h3.geoToH3(data.geopoint.latitude, data.geopoint.longitude, 3);
        const h3Index4 = h3.geoToH3(data.geopoint.latitude, data.geopoint.longitude, 4);
        const h3Index5 = h3.geoToH3(data.geopoint.latitude, data.geopoint.longitude, 5);
        const h3Index6 = h3.geoToH3(data.geopoint.latitude, data.geopoint.longitude, 6);
        const h3Index7 = h3.geoToH3(data.geopoint.latitude, data.geopoint.longitude, 7);
        const h3Index8 = h3.geoToH3(data.geopoint.latitude, data.geopoint.longitude, 8);
        const h3Index9 = h3.geoToH3(data.geopoint.latitude, data.geopoint.longitude, 9);
        const h3Index10 = h3.geoToH3(data.geopoint.latitude, data.geopoint.longitude, 10);
        const h3Index11 = h3.geoToH3(data.geopoint.latitude, data.geopoint.longitude, 11);
        this.h3_geohash = { 
                    l1: h3Index1,
                    l2: h3Index2,
                    l3: h3Index3,
                    l4: h3Index4,
                    l5: h3Index5,
                    l6: h3Index6,
                    l7: h3Index7,
                    l8: h3Index8,
                    l9: h3Index9,
                    l10: h3Index10,
                    l11: h3Index11,
                  }
      }
    }catch (e) {
      
    }
  }

  getCoordinates  = () => {return this.geopoint}

}

export class PlaceSuggestion {
  constructor(data) {
    data = data || {}
    this.id = data.id
    data.title = data.title.replace(/\n/g, ", ")
    data.vicinity = data.vicinity.replace(/\n/g, ", ")

    this.title = data.title
    this.highlightedTitle = data.highlightedTitle
    this.vicinity = data.vicinity
    this.highlightedVicinity = data.highlightedVicinity.replace(/\n/g, ",")
    this.position = {latitude: data.position[0], longitude: data.position[1]}
    this.category = data.category
    this.categoryTitle = data.categoryTitle
    this.href = data.href
    this.type = data.type
    this.resultType = data.resultType
    this.label = `${data.title} ${data.vicinity}`
    this.highlightedLabel =  `${data.highlightedTitle} ${data.highlightedVicinity}`
  }
}

export class PlaceAddress{
  constructor(data){
    data = data || {}
    this.house = data.house
    this.street = data.street
    this.postalCode = data.postalCode
    this.county = data.county
    this.district = data.district
    this.state = data.state
    this.stateCode = data.stateCode
    this.country = data.country
    this.countryCode = data.countryCode
  }
}

export class PlaceAccess {
  constructor(data) {
    data = data || {}
    this.position = new PlacePosition(data.position)
    this.access_type = data.access_type
  }
}

export class PlacePosition {
  constructor(data) {
    data = data || {}
    this.geohash = data.geohash || ""
    if (Array.isArray(data) && data.length === 2){
      this.latitude = data[0]
      this.longitude = data[0]
    }else{
      this.latitude = data.latitude || 0
      this.longitude = data.longitude || 0
    }
  }

  getPositionArray(){
    return [this.latitude, this.longitude]
  }
}

export class PlaceLocation {
  constructor(data) {
    data = data || {}
    this.position = new PlacePosition(data.position)
    this.address = new PlaceAddress(data.address)
    this.access = new PlaceAccess(data.access)
  }
}

export class PlaceCategory {

  constructor(data) {
    data = data || {}
    this.id = data.id
    this.title = data.title
    this.type = data.type
    this.icon = data.icon
  }
}

export class Place {
  constructor(data) {
    data = data || {}
    this.name = data.name
    this.placeId = data.placeId
    this.location = new PlaceLocation(data.location)
    this.categories = (data.categories || []).map(category => {return new PlaceCategory(data)})
  }
}

export class Location {

  constructor(data){
    data = data || {}
    try{
      if (data.address){
        data.address = new Address(data.address)
        data.label =  [`${data.address.houseNumber || ""} ${data.address.street || ""} ${data.address.city || ""}`, data.address.state, data.address.postalCode, data.address.country].join(", ")
      }else{
        data.address = {}
        data.label = data.label || ""
      }
    }catch (e) {

    }

    this.matchLevel = data.matchLevel
    this.locationId = data.locationId
    this.placeId = data.placeId
    this.id = this.placeId || this.locationId
    this.displayPosition = new Position(data.displayPosition || {})
    this.navigationPositions = (data.navigationPositions || []).map(position => new Position(position || {}))
    this.address = data.address
    this.href = data.href || ""
    this.bbox = data.bbox || []
    this.label = data.label
    // this.label = data.label || `${this.address.houseNumber} ${this.address.street}, ${this.address.city}, ${this.address.state}, ${this.address.country}`
    this.shortLabel = `${this.address.city}, ${this.address.state}`
    this.utc_offset = data.utc_offset  || 0
  }

  static position(latitude, longitude){
    return new Position({geopoint: {latitude: latitude, longitude: longitude}})
  }

  static coordinates(latitude, longitude){
    return {latitude: latitude, longitude: longitude}
  }

  getAddressText({show_street_number=false, show_street, show_city=false, show_state=false,
                   show_country=true, show_postal_code=false}){
    let street_number = show_street_number ? `${this.address.houseNumber}` : ""
    let street = show_street ? ` ${this.address.street}` : ""
    let city = show_city ? `, ${this.address.city}` : ""
    let state = show_state ? `, ${this.address.state}` : ""
    let postal_code = show_postal_code ? `, ${this.address.postal_code}` : ""
    let country = show_country ? `, ${this.address.country}` : ""
    return `${street_number}${street}${city}${state}${postal_code}${country}`
  }

}
export const LocationType = (value) => {
  return COMPANY_LOCATION_TYPES[value] ? value : ""
}
