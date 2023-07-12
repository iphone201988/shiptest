// import firebase from 'firebase';
import ReduxSagaFirebase from "redux-saga-firebase";

export default class FirebaseHelper {
  isValid = true;
  EMAIL = 'email';

  constructor(firebaseApp) {

    this.App = firebaseApp
    this.Auth = firebaseApp.auth()

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.database = this.isValid && this.App.firestore();
    if (this.database) {
      const settings = { };
      this.database.settings(settings);
    }
    this.rsf = this.isValid && new ReduxSagaFirebase(this.App, this.App.firestore());
    this.rsfFirestore = this.isValid && this.rsf.firestore;
  }

  createBatch = () => {
    return this.database.batch();
  };

  login(provider, info) {
    if (!this.isValid) {
      return;
    }
    switch (provider) {
      case this.EMAIL:
        return this.Auth.signInWithEmailAndPassword(
            info.email,
            info.password
        );
      default:
    }
  }

  logout() {
    return this.Auth.signOut();
  }

  isAuthenticated() {
    this.Auth.onAuthStateChanged(user => {
      return user ? true : false;
    });
  }

  setComponentLoginState(component){
    this.Auth.onAuthStateChanged(auth_user => {
      if (auth_user){
        component.setState({isLoggedIn: true})
      }else{
        component.setState({isLoggedIn: false})
      }
    });
  }

  sendVerificationEmail(){
    let user = this.Auth.currentUser
    user.sendEmailVerification()
  }


  resetPassword(email) {
    return this.Auth.sendPasswordResetEmail(email);
  }
  createNewRef() {
    return this.App
        .database()
        .ref()
        .push().key;
  }

  createUserWithEmailAndPassword(email, password) {
    return this.Auth.createUserWithEmailAndPassword(email, password)
  }

  deleteCurrentUser(){

    var user = this.Auth.currentUser;
    user.delete().then(function() {

    }).catch(function(error) {
      // An error happened.
    });
  }

  signInWithEmailAndPassword(email, password){
    return this.Auth.signInWithEmailAndPassword(email, password)
  }

  processFireStoreCollection(snapshot) {
    let data = {};
    snapshot.forEach(doc => {
      data = {
        ...data,
        [doc.id]: doc.data(),
      };
    });
    return data;
  }
}
