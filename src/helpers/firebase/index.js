import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import { appFirebaseConfig } from 'settings';

export const app = firebase.initializeApp(appFirebaseConfig)

firebase.firestore().settings({ })
export  const db = firebase.firestore(app);

export default firebase