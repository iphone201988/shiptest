import firebase from "firebase/app";
import "firebase/functions";

import {ObjectToJSON} from "../../data/format";
import {handleHttpError} from "../../error/errors";
import { emulator } from 'settings';

const call_prefix = "shiphaul_oncall-"
const emulator_port = 5001

export const callFunction = (name, data) => {
 
    name = call_prefix + name
    let callFunction = undefined
    if (emulator){
        callFunction =  firebase.functions().useEmulator("localhost", emulator_port)
    }else{
        callFunction = firebase.functions().httpsCallable(name);
    }
    return callFunction(ObjectToJSON(data)).then(result => {
        return result.data;
    }).catch( error => {
            handleHttpError(error,  {throwError: true, logError:true})
        }
    )
}

