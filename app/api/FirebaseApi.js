import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyB-G6MUo2gZeP5qVpv1B-Nb67i-VUUPC18",
  authDomain: "regattacomptime.firebaseapp.com",
  projectId: "regattacomptime",
  storageBucket: "regattacomptime.appspot.com",
  messagingSenderId: "762245821544",
  appId: "1:762245821544:web:35119f80da86f7dcc4b7dd",
  measurementId: "G-VCJ6T7JN8L",
};

function FirebaseApi(props) {}

function getFirebase() {
  if (!firebase.apps.length) {
    return firebase.initializeApp(firebaseConfig);
  } else {
    return firebase.app(); // if already initialized, use that one
  }
}

export function getBoatList() {
  console.log("getBoatList CALLED");
  return new Promise((resolve, reject) => {
    getFirebase()
      .database()
      .ref("boatList/")
      .on("value", (boatList) => {
        let boatArray = [];
        boatList.forEach((boat) => {
          boatArray[boat.key] = boat.val();
        });

        const boatArraySorted = boatArray.sort((a, b) =>
          a.name > b.name ? 1 : -1
        );
        resolve(boatArraySorted);
      });
  });
}
