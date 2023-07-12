import {updateIntegrationCredential} from "helpers/firebase/firebase_functions/integrations";

const axios = require("axios");
const qs = require('qs');


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class APIClient {

    constructor() {
        this.provider = ''
        this.companyIntegration = {}
    }

    async request(options) {
        const retries = 10
        const waitInterval = 500

        for (let i = 0; i < retries-1; i++){
            if (this.isExpired()){
                if (i == 0){
                    updateIntegrationCredential({provider: this.provider})
                }
                await sleep(waitInterval)
            }else{
                break;
            }
        }
        try{
            const response = await axios.request(options)
            if (response.ok){
                return response.data
            }else{
                console.log(response)
                return {}
            }
        }catch(e){
            console.error(e.message)
            throw e;
        }

        // return axios.request(options).then( (response) => {
        //     if (response.ok){
        //         return response.data
        //     }else{
        //         console.log(response)
        //         return {}
        //     }
        // }).catch(e=>{
        //     console.error(e.message)
        //     throw e;
        // })
    }

    isExpired = () =>{
        return this.companyIntegration.isCredentialsExpired()
    }

    getCredentials(){
        return this.companyIntegration.credentials
    }

    setCredentials(credentials){
        this.credentials = credentials
    }

    setIntegrationObject = (companyIntegration) => {
        this.companyIntegration = companyIntegration
    }

    queryString = (params) => {
        return qs.stringify(params, { indices: false })
    }
}