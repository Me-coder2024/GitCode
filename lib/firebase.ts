import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type Auth,
  type UserCredential,
} from "firebase/auth";

// ==========================================
// Firebase Client SDK Configuration
// ==========================================

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Singleton: reuse existing app if already initialized
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google popup.
 * 1. Opens the Google sign-in popup
 * 2. Retrieves the Firebase ID token
 * 3. POSTs the token to /api/auth/firebase to set the session cookie
 * 4. Returns the Firebase user
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();

    // Send token to our API route to set the session cookie
    const response = await fetch("/api/auth/firebase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: idToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Authentication failed (${response.status})`
      );
    }

    return result;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
}

/**
 * Sign out the current user.
 * Clears the Firebase auth state and removes the session cookie
 * by calling the API route with DELETE.
 */
export async function signOutUser() {
  try {
    // Clear the server-side session cookie
    await fetch("/api/auth/firebase", {
      method: "DELETE",
    });

    // Sign out from Firebase client
    await signOut(auth);
  } catch (error) {
    console.error("Sign-out error:", error);
    throw error;
  }
}

export { auth, googleProvider };
