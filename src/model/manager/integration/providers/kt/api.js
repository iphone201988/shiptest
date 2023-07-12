import {KTConfig} from './config'
import {APIClient} from "../../api_client/api_base_class";

const qs = require('qs');

export default class KeepTruckingAPI extends APIClient{

    constructor(config, params={}){
        super();
        this.provider = 'keeptruckin'
        this.apiURL = config.apiURL
        this.homeURL = config.homeURL
        this.version = config.version
        this.baseURL = `${config.apiURL}/${this.version}/`
        this.endpoints = config.endpoints
        this.clientId = config.clientId
        this.redirectURL = config.redirectURL
        this.scopes = config.scopes
        this.credentials = config.credentials || {}
    }

    apiHeaders = (headers={}) => {
        return {
            "Authorization": `Bearer ${this.companyIntegration.credentials?.access_token}`,
            "Accept": "application/json"
        }
    }

    url = (endpoint) => {
      return `${this.apiURL}/${endpoint}`;
    }

   async apiRequest(endpoint, method) {
        const url = this.url(endpoint)
        return this.request({url: url, headers: this.apiHeaders(), method:method})
    }

    getAuthorizeUrl = () => {
        return `${this.homeURL}/${this.endpoints["authorize"]}?${
            this.queryString( {client_id:  this.clientId, redirect_uri: this.redirectURL, response_type: "code", 
                scope: this.scopes})}`
    }

    async getVehicles(params){
       const response =  await this.apiRequest("vehicles", "GET");
       // map to Vehicle objects
       return response;
    }

    async getDevices(params){
      const response =  await this.apiRequest("devices", "GET");
      // map to Vehicle objects
      return response;
    }

}

// export default new KeepTruckingAPI(KTConfig, {})