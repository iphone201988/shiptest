const queryString = require('qs');

export class hereAPI {

  constructor(config){
    this.appId = config.appId
    this.appCode = config.appCode
    this.apiUrls = config.apiUrls
  }

  fetch = (url, kwargs) => {
    return fetch(url, kwargs).then((response) => {
      if (response.ok) {
        return response.json()
      }else{ throw new Error("Error")}
    })
  }

  query_str = (params) => {
    return `?app_id=${this.appId}&app_code=${this.appCode}&${queryString.stringify(params)}`
  }


}