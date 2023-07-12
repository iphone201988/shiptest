import {handle_backend_response} from "../error/error_handler";
import {objectToKeyValList} from "../data/mapper";

export const SimpleCollectionRequest = (request_function, {keyValList = false} = {}) => {
  const data = request_function()
      .then(res => handle_backend_response(res))
      .then(res => res.json())
  if (keyValList) {
    return data.then(data => objectToKeyValList(data))
  } else {
    return data
  }
}