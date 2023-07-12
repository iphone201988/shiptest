import BackendHelper from '../../backend'
import {hereAPI, HERE_URLS} from './hereApi'
import {hereConfig} from '../config'


const PATHS = {
  'auth': '/users/v2/login',
  '': ''
}

class Tracking extends hereAPI{

  auth(){
    const url = URL(PATHS.auth ,this.apiUrls.tracking)
  }

}

export default new HereGeocoder(hereConfig)