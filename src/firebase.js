import firebase from 'firebase'
require("firebase/auth");
require("firebase/firebase");
require("firebase/storage");
require("firebase/functions");

var config = {
    apiKey: "AIzaSyDndUDBd3E54-SiWvjRnvhsOl3ODDeUGA0",
    authDomain: "botanicauaa.firebaseapp.com",
    databaseURL: "https://botanicauaa.firebaseio.com",
    projectId: "botanicauaa",
    storageBucket: "botanicauaa.appspot.com",
    messagingSenderId: "992941645813"
  };

firebase.initializeApp(config);
firebase.firestore().settings({
  timestampsInSnapshots: true
})
const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()
const functions = firebase.functions()

export{
    firebase,
    auth,
    db,
    storage,
    functions
}


