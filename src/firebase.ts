import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// Firebase configuration - users should replace with their own config
const firebaseConfig = {
  apiKey: "AIzaSyBDL82lm8hVs2AYfWYeFG6dSuA1YjKRItg",
  authDomain: "healthiq-cef80.firebaseapp.com",
  projectId: "healthiq-cef80",
  storageBucket: "healthiq-cef80.firebasestorage.app",
  messagingSenderId: "665958409758",
  appId: "1:665958409758:web:deeb40a75caeb5cf53300f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithEmail = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
export const signUpWithEmail = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
export const logOut = () => signOut(auth);

export default app;
