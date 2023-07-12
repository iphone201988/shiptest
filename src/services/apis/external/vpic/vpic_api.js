// https://vpic.nhtsa.dot.gov/api/

const base_url = "https://vpic.nhtsa.dot.gov/api/"

export default class VPIC_VIN_API {


	// constructor(){
	// 	this.base_url = "https://vpic.nhtsa.dot.gov/api/"
	// }

	static fetch = (url, kwargs) => {
		return fetch(url, kwargs).then((response) => {
			if (response.ok) {
				return response.json()
			}else{ throw new Error("Error")}
		})
	}

	static decodeVIN(params) {

		const path = `/vehicles/DecodeVinValuesExtended/${params.VIN}?format=json`
		const url = base_url + path
		return this.fetch(url, {method: "GET"}).then(response =>
		{
			let result = {}
			if (response.Results && response.Results.length > 0 ){
				result = response.Results[0]
			}
			return result
		})
	}
}

