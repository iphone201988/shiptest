import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import contactSagas from './contacts/saga';
import invoicesSagas from './invoice/saga';
import chatSagas from './chat/sagas';
import carrierSagas from './carrier/sagas';
import FirebaseAuthSagas from './firebase_auth/sagas';

export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    contactSagas(),
    invoicesSagas(),
    chatSagas(),
    carrierSagas(),
    FirebaseAuthSagas()
  ]);
}
