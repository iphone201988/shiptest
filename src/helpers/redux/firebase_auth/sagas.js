import {all, takeEvery, put, fork, call} from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { clearToken } from 'helpers/utility';
import actions from './actions';
import {handle_firebase_error} from "../../error/error_handler";
import Firebase from "helpers/firebase";

const onLoginRequest = async (email, password) =>

    await Firebase.signInWithEmailAndPassword(email, password)
        .then(res => res.user.getIdToken().then(res => res))
        .catch(error => handle_firebase_error(error))


export function* loginRequest() {
  yield takeEvery('LOGIN_REQUEST', function*(email, password) {
    const id_token =  yield call(onLoginRequest, email, password);
    if (id_token){
      yield put({
        type: actions.LOGIN_SUCCESS,
        Idtoken: id_token,
      });
    }

  });
}

export function* loginSuccess() {
  yield takeEvery(actions.LOGIN_SUCCESS, function*(payload) {
    // yield localStorage.setItem('id_token', payload.token);
  });
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function*() {});
}

export function* logout() {
  yield takeEvery(actions.LOGOUT, function*() {
    clearToken();
    yield put(push('/'));
  });
}
export function* checkAuthorization() {
  yield takeEvery(actions.CHECK_AUTHORIZATION, function*() {

    if (Firebase.currentUser != null){
      yield put({
        type: actions.LOGIN_SUCCESS
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(checkAuthorization),
    fork(loginRequest),
    fork(loginSuccess),
    fork(loginError),
    fork(logout)
  ]);
}
