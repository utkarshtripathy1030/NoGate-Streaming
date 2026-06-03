import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "./firebaseConfig";

// User type for our application
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
}

// Convert Firebase User to AppUser
const convertToAppUser = (user: User): AppUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  phoneNumber: user.phoneNumber,
});

// Authentication service
export const authService = {
  /**
   * Register with email and password
   */
  register: async (email: string, password: string): Promise<AppUser> => {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return convertToAppUser(userCredential.user);
  },

  /**
   * Login with email and password
   */
  login: async (email: string, password: string): Promise<AppUser> => {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return convertToAppUser(userCredential.user);
  },

  /**
   * Login with Google
   */
  loginWithGoogle: async (): Promise<AppUser> => {
    const userCredential: UserCredential = await signInWithPopup(
      auth,
      googleProvider
    );
    return convertToAppUser(userCredential.user);
  },

  /**
   * Login with Facebook
   */
  loginWithFacebook: async (): Promise<AppUser> => {
    const userCredential: UserCredential = await signInWithPopup(
      auth,
      facebookProvider
    );
    return convertToAppUser(userCredential.user);
  },

  /**
   * Logout
   */
  logout: async (): Promise<void> => {
    await signOut(auth);
  },

  /**
   * Get current user
   */
  getCurrentUser: (): AppUser | null => {
    const user = auth.currentUser;
    if (!user) return null;
    return convertToAppUser(user);
  },

  /**
   * Listen to authentication state changes
   */
  onAuthChange: (callback: (user: AppUser | null) => void): (() => void) => {
    return onAuthStateChanged(auth, (user) => {
      callback(user ? convertToAppUser(user) : null);
    });
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return auth.currentUser !== null;
  },

  /**
   * Get Firebase User object (for internal use)
   */
  getFirebaseUser: (): User | null => {
    return auth.currentUser;
  },
};
