
var urljoin = require('url-join');

class BackendHelper {

    constructor(){

        // TODO  define this map in a config
        this.backend_base_map = {
            shipping: 'http://127.0.0.1:8020/shipping/'
        }

    }

    url (base_url, path) {
        return urljoin(base_url, path)
    }


  fetch(method, url, headers, {data={}}={}){

    if (method in {GET: null, DELETE: null}){
      let response = fetch(url, {
        method : method,
        headers: headers}
      );
      return response
    }else{
      let response = fetch(url, {
        method : method,
        headers: headers,
        body: JSON.stringify(data)})
      return response
    }
  }

    async fetchBackend(base_url, method, path, {auth = null, require_authorization=false,
      app=null, handle_error=true, data={}, ResponseObject=null}={}) {
      const url = this.url(base_url, path)

      var headers = {}
      let response = null

      if (auth){
        let user = null
        user =auth.currentUser

        let IdToken = await user.getIdToken(true)
        headers = {"Content-Type": "application/json; charset=utf-8", Authorization: `Bearer ${IdToken}`};
        response = await this.fetch(method, url, headers, {data: data});
      }else{
        headers = {"Content-Type": "application/json; charset=utf-8"}
        response = await this.fetch(method, url, headers, {data: data})
      }

      if (ResponseObject){
        return ResponseObject(response)
      }

      return response
    }

}

export default new BackendHelper();