// import actions from './actions';
// import { all, takeEvery, put, call } from 'redux-saga/effects';
// import BackendHelper  from 'helpers/backend';
// import {handle_backend_response} from "helpers/error/error_handler";
// import SessionHelper from "helpers/session";

// const onGetCarrier = async () =>

//     await SessionHelper.getLoggedUser().getIdtoken().then(
//         (idToken) => {BackendHelper.fetchAsync("shipping", "GET", "carrier2/", {idToken: idToken})
//         .then(handle_backend_response)
//         .then(res => res.json())
//         .then(res => res)
//     })

// export function* getCarrier (){
//   try{
//     const carrier =  yield call(CarrierService.getCurrentCarrier);
//     if (carrier){
//       yield put(
//           {
//             type: actions.GET_CARRIER_SUCCESS,
//             carrier: carrier
//           }
//       )
//       // yield put(actions.getCarrierSuccess(carrier))
//     }else{
//       yield put(actions.getCarrierFail(carrier))
//     }

//     // if (response.ok){
//     //   let carrier_json = response.toJSON()
//     //   yield put(actions.getCarrierSuccess(carrier_json.info, carrier_json.account_status));
//     // }
//     // else {
//     //   yield put(actions.getCarrierSuccess());
//     // }
//   } catch (error) {yield put(actions.getCarrierFail());}
// }


// // export function* updateCarrierProfile ({payload}) {
// //   const { registration_data, login } = payload;
// //
// //   const response = yield call(
// //       onRegisterCarrier,
// //       registration_data,
// //       login
// //   );
// // }

// export default function* rootSaga() {
//     yield all([
//         takeEvery(actions.GET_CARRIER, getCarrier)]);
// }

