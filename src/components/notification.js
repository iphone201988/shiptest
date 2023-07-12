import notification from './feedback/notification'

const createNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};

export function notify(type, message, {description = "", intl = {}}={}){

  if (intl.formatMessage){
    message = intl.formatMessage({id: message})
    description = description ? intl.formatMessage({id: description}) : ""
  }
  createNotification(type, message, description)
}

export function notifySuccess(message, {description, intl = {}} = {}){
  notify("success", message, {description: description, intl: intl})
}

export function notifyError(message, {description = "", intl = {}}={}){
  notify("error", message, {description: description, intl: intl})
}


export default createNotification