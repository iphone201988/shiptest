const actions = {
  CHECK_AUTHORIZATION: 'CHECK_AUTHORIZATION',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGOUT: 'LOGOUT',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  checkAuthorization: () => ({ type: actions.CHECK_AUTHORIZATION }),
  login: (email, password) => ({
    type: actions.LOGIN_REQUEST,
    email: email,
    password: password,
  }),
  login_success: (idToken) => ({
    type: actions.LOGIN_SUCCESS,
    idToken: idToken,
    isLoggedIn: true
  }),
  logout: () => ({
    type: actions.LOGOUT
  })
};
export default actions;