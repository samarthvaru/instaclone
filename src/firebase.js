import firebase from "firebase";

const firebaseApp=firebase.initializeApp({
    apiKey: "AIzaSyCaeP2ULQTOdGY-J7VzssjMLHE-mroqqiE",
    authDomain: "instagram-react-clone-9d383.firebaseapp.com",
    databaseURL: "https://instagram-react-clone-9d383.firebaseio.com",
    projectId: "instagram-react-clone-9d383",
    storageBucket: "instagram-react-clone-9d383.appspot.com",
    messagingSenderId: "389972112807",
    appId: "1:389972112807:web:c6e53ca103aaa91faef282",
    measurementId: "G-R5D8NPKQPR"
});
const db=firebaseApp.firestore();
const auth=firebase.auth();
const storage= firebase.storage();

  export {db,auth,storage};