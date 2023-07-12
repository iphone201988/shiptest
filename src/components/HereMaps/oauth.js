import { updateIntegrationCredential } from "helpers/firebase/firebase_functions/integrations";

export async function getToken() {
  const data = {
    provider: "here"
  }
  const token = await updateIntegrationCredential(data) ;
  console.log('#####token is:$$$$$', token);
  const {access_token} = token ;
  const requestHeaders = { // Preparing the headers
    'Authorization': 'Bearer ' + access_token
};
const url = "https://1.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/13/4400/2686/256/png8";

 return fetch(url, { // making a request 
        method: 'get',
        headers: requestHeaders
    })
    .then(function(res) {
        console.log('hooray', res);
    })
    .catch(function(e) {
        console.log('Error:', e);
    });
}

// export async function refreshToken() {
//   data = {
//     provider: 'heremaps'
//   }
//   const token = await updateIntegrationCredential(data) ;
//   const {access_token, expires_in} = token ;
//   const expiry = expires_in + Date.now() ;
//   let isExpired = false ;

//   if(Date.now() > expiry) {
//     isExpired = true;
//   }

//   isExpired? getToken(access_token) : access_token ;
// }