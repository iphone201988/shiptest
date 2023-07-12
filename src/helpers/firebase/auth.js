

class AuthHelper{

	async static Authorize(firebase, options){

		const currentUser = firebase.auth().currentUser
		return currentUser.getIdTokenResult().then(

		).catch()


	}


}