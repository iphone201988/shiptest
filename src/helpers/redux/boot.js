import { store } from './store';
import authActions from './firebase_auth/actions';

export default () =>
  new Promise(() => {
    store.dispatch(authActions.checkAuthorization());
  });
