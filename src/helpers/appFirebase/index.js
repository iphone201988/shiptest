import firebase from 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore';
import { appFirebaseConfig } from 'settings';
import FirebaseHelper  from 'helpers/firebase/FirebaseHelper'

const valid = appFirebaseConfig && appFirebaseConfig.apiKey && appFirebaseConfig.projectId;

const firebaseApp = valid && firebase.initializeApp(appFirebaseConfig, "ShipHaulApp");

export default new FirebaseHelper(firebaseApp);
