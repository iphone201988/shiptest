import Notification from "components/notification";


class ErrorHandler{
  constructor(type, {code=null, message='', description=''}={}){
    this.type = type
    this.code = code
    this.message = message
    this.description = description
  }

  notify(){
    Notification(
        this.type,
        this.message,
        this.description
    );
  }
}

async function handle_backend_response(response){
  if (response.ok === false) {
    var message =  ''
    try{
      let body = await response.json()
      message = body.message
    }catch (e) {
      message =  'An Error has occured'
    }
    let handler = new ErrorHandler('error', {code:response.status, message:message})
    handler.notify()

    return new Promise((resolve, reject) => {
      reject(Error(message));
    });
  }
  return response
}





function handle_firebase_error(error , {throw_error=true} = {}){
  // let handler = new ErrorHandler('error', {code:error.code, message:error.message, description:error.details})
  if (throw_error){
    throw error
  }

}

export {handle_backend_response, handle_firebase_error}



