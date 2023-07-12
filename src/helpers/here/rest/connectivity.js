import BackendHelper from '../../backend'
import {hereAPI, HERE_URLS} from './hereApi'
import {hereConfig} from '../config'

class HereConnectivity extends hereAPI{

  listupdates(params){

    const qs_params = this.query_str(params)
    const url = this.apiUrls.connectivity + "listupdates.json" + qs_params
    let result = this.fetch(url, {method: "GET"})
        .then(result =>{ return result.events})
    return result
  }
}

export default new HereConnectivity(hereConfig)