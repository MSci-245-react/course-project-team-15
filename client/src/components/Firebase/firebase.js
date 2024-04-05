import { initializeApp } from 'firebase/app';
import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut,
sendPasswordResetEmail,
updatePassword,
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBQpmReNQV1f9I5zXvFDxDmdc33gA2zDTU",
  authDomain: "msci342-team-15.firebaseapp.com",
  databaseURL: "https://msci342-team-15-default-rtdb.firebaseio.com",
  projectId: "msci342-team-15",
  storageBucket: "msci342-team-15.appspot.com",
  messagingSenderId: "804541336108",
  appId: "1:804541336108:web:3ec31e6443ec7290669f89",
  measurementId: "G-QZ00EX7L7W"
};

const app = initializeApp(firebaseConfig)

 class Firebase {
  constructor() {
    this.auth = getAuth(); // Corrected here
    this.db = getFirestore(app);
  }

  doSetUserData = (uid, userData) => {
    const userRef = doc(this.db, 'users', uid);
    return setDoc(userRef, userData);
  };

  doCreateUserWithEmailAndPassword = (email, password, firstName, lastName) => {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          firstName: firstName,
          lastName: lastName,
        };
        return this.doSetUserData(user.uid, userData);
      })
      .catch(error => {
        console.error("Error creating user:", error);
        throw error;
      });
  };

  // *** Auth API ***

  // doCreateUserWithEmailAndPassword = (email, password) =>
  //   createUserWithEmailAndPassword(this.auth, email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    signInWithEmailAndPassword(this.auth, email, password);

  doSignOut = () => signOut(this.auth);

  doPasswordReset = email => sendPasswordResetEmail(this.auth, email);

  doPasswordUpdate = password =>
    updatePassword(this.auth.currentUser, password);

  // Function to get ID Token of the currently signed-in user
  doGetIdToken = () => {
    return new Promise((resolve, reject) => {
      const user = this.auth.currentUser;
      if (user) {
        user
          .getIdToken()
          .then(token => {
            resolve(token);
          })
          .catch(error => {
            reject(error);
          });
      } else {
        reject(new Error('No user is signed in.'));
      }
    });
  };
}

export default Firebase;
    