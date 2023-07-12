import {hereAPI} from './hereApi'
import {hereConfig} from '../config'

class HereGeocoder extends hereAPI{

  suggest(params, {matchLevel=null}={}){
    /**
     *  params: query, maxresults, country, mapview, prox, beginHighlight, endHighlight, language, resultType
     */
    const qs_params = this.query_str(params)
    const url = this.apiUrls.autocomplete + qs_params
    let result = this.fetch(url, {method: "GET"}).then(data => data["suggestions"])
    if (matchLevel){
      result =   result.then(suggestions =>
          suggestions.filter(suggestion => suggestion.matchLevel === matchLevel))
    }
    return result
  }

  geocode(params, matchLevel= "houseNumber"){
    const default_params = {
      "locationattributes": "adminInfo,timeZone",
    }
    params = Object.assign(default_params, params);

    const qs_params = this.query_str(params)
    const url = this.apiUrls.geocoder + qs_params
    let result = this.fetch(url, {method: "GET"}).then(
        data => data.Response.View[0].Result[0]
    )
    if (matchLevel){
      // result = result.filter(r => r.matchLevel == matchLevel)
    }

    return result
  }

  reverse_geocode(params, matchLevel = "houseNumber"){

    const default_params = {
      "locationattributes": "adminInfo,timeZone",
      "maxresults": 10,
      "gen": 9,
      "level": matchLevel,
      "mode": "retrieveAddresses"
    }

    params = Object.assign(default_params, params);

    const qs_params = this.query_str(params)
    const url = this.apiUrls.reverse_geocode + qs_params

    return this.fetch(url, {method: "GET"}).then(
      data => data.Response.View[0].Result
    ).then(data => data.matchLevel === matchLevel)

  }

  LocationCoordinates(locationID){

    return this.geocode({locationid: locationID}).then(result =>
        {
          return result.Location.DisplayPosition
        }
    ).catch(e=>{})

  }

}

export default new HereGeocoder(hereConfig)