import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
// import { createBrowserHistory } from 'history'
import { createBrowserHistory } from 'history';
import { routerReducer, routerMiddleware } from 'react-router-redux';

import {reactReduxFirebase} from 'react-redux-firebase'
import { reduxFirestore } from 'redux-firestore'
import firebase from 'helpers/firebase'
import 'firebase/auth'
import 'firebase/firestore'

import { initialState } from './reducers'

import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import rootSaga from './sagas';

const history = createBrowserHistory()
const sagaMiddleware = createSagaMiddleware();
const routeMiddleware = routerMiddleware(history);
const middlewares = [thunk, sagaMiddleware, routeMiddleware];

//eslint-disable-next-line
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const enhancers = [
  applyMiddleware(...middlewares),
  reduxFirestore(firebase, {dispatchRemoveAction: true}),
  reactReduxFirebase(firebase, {
    useFirestoreForProfile: true,
    dispatchRemoveAction: true
  }),
]

const reduxDevToolsExtension = window.devToolsExtension
if (
  process.env.NODE_ENV === "development" &&
  typeof reduxDevToolsExtension === "function"
) {
  enhancers.push(reduxDevToolsExtension())
}

const composedEnhancers = compose(...enhancers)

const store = createStore(combineReducers({...reducers,  router: routerReducer}),
  initialState, composedEnhancers)
sagaMiddleware.run(rootSaga);


export { store, history };

// export default store