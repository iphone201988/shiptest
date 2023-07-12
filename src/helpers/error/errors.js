export class HttpError extends Error{

    constructor(code, message, details = '' ) {
        super(message)
        this.code = code || "unknown"
        this.details = details || ''

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpError)
        }
    }
}

export function handleHttpError(error, {throwError = false, logError=true}={}){
    if (logError){
        const log_message = `${error.code} ${error.message} ${error.details}`
        console.error(log_message)
    }
    if (throwError){
        throw error
    }
   
}
