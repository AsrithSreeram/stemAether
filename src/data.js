import firebase from "firebase";
import { doc, getDoc } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router";
import { user } from './App.js'

const firebaseConfig = {
    apiKey: "AIzaSyBXDwRwO0_Lnk8SXgvcG9TVaE7RMIeStwA",
    authDomain: "stem-aether.firebaseapp.com",
    databaseURL: "https://stem-aether-default-rtdb.firebaseio.com",
    projectId: "stem-aether",
    storageBucket: "stem-aether.appspot.com",
    messagingSenderId: "147898812728",
    appId: "1:147898812728:web:779aa43159105aaa5819cd"
  };

const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const db = app.firestore();


const googleProvider = new firebase.auth.GoogleAuthProvider();

const signInWithGoogle = async () => {
  
  try {
    const res = await auth.signInWithPopup(googleProvider);
    const user = res.user;
    const query = await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get();
    if (query.docs.length === 0) {
      await db.collection("users").add({
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


const logout = () => {
  auth.signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
};


const checkoutRoom = async (floorNum, roomNum) => {
  const res = await db.collection(floorNum).doc(roomNum).get();
  const data = res.data();
  console.log(data);

//   db.collection("rooms").doc("0").set({
//     roomName: "1234",
//     occupied: true
// })
}

const occupyRoom = async (floorNum, roomNum, displayName) => {
  db.collection(floorNum).doc(roomNum).set({
    occupied: true,
    peopleNames: [displayName]
  },
  { merge: true }
  )
}


// await setDoc(doc(db, "rooms", "G"), {
//   roomName: "Los Angeles",
//   name: "CA",
//   params: "USA",
//   range: ""
// });


export {
  auth,
  db,
  signInWithGoogle,
  logout,
  checkoutRoom,
  occupyRoom
};