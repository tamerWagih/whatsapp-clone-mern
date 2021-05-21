import firebase from 'firebase';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: 'whatsapp-clone-706f6.firebaseapp.com',
  projectId: 'whatsapp-clone-706f6',
  storageBucket: 'whatsapp-clone-706f6.appspot.com',
  messagingSenderId: '154487133706',
  appId: '1:154487133706:web:3b4dd6f02150c78e2db1f3',
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
