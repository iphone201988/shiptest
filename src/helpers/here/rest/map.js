import BackendHelper from '../../backend'
import {hereAPI, HERE_URLS} from './hereApi'
import {hereConfig} from '../config'

class HereMapImage extends hereAPI{

  suggest(params, {matchLevel=null}={}){
    /**
     *  params: query, maxresults, country, mapview, prox, beginHighlight, endHighlight, language, resultType
     */
    const qs_params = this.query_str(params)
    const url = this.apiUrls.autocomplete + qs_params
    let result = this.fetch(url, {method: "GET"}).then(data => data["suggestions"])
    if (matchLevel){
      result =   result.then(suggestions =>
          suggestions.filter(suggestion => suggestion.matchLevel == matchLevel))
    }
    return result
  }

  map_routing(params){
    const qs_params = this.query_str(params)
    const url = this.apiUrls.map_routing + qs_params
    return this.fetch(url, {method: "GET"})
  }


}

export default new HereMapImage(hereConfig)