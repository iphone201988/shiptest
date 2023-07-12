import {hereAPI} from './hereApi'
import {hereConfig} from '../config'

class Place extends hereAPI{

  getPlace = (href) =>{
    const header = {Accept: "application/json", "Accept-Language": "en", "Accept-Encoding": "gzip"}
    return this.fetch(href, {method: "GET", header: header}).then(data => data).catch(e=> {
      console.error(e.message)
    })
  }

  place = (id) => {

    const header = {Accept: "application/json", "Accept-Language": "en", "Accept-Encoding": "gzip"}
    const qs_params = this.query_str({})
    const url = this.apiUrls.places_place  + id + qs_params
    return this.fetch(url, {method: "GET", header: header}).then(data => data)
  }

  autosuggest = (params) =>{

    const default_params = {
      "countryCode": "CAN",
      "size": 7,
      "tf": "plain",
      "result_types": "address,place"
    }

    params = Object.assign(default_params, params);
    const qs_params = this.query_str(params)
    const url = this.apiUrls.places_autosuggest  + qs_params
    const headers = {
      "X-Map-Viewport" : "-147.0514,23.7528,-48.3285,62.9832", // North America
      "X-Mobility-Mode": "drive",
      "Accept-Language": "en-US,en;q=0.9,es-419;q=0.8,es;q=0.7,fr-CA;q=0.6,fr;q=0.5",
    }

    return this.fetch(url, {method: "GET", headers: headers}).then(data => data["results"]).catch(e =>
    {throw e})
  }


}

export default new Place(hereConfig)