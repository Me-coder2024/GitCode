import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth, type DecodedIdToken } from "firebase-admin/auth";

// ==========================================
// Firebase Admin SDK (Server-Side Only)
// ==========================================

/**
 * Initialize Firebase Admin with singleton pattern.
 * Uses the FIREBASE_SERVICE_ACCOUNT_KEY env var which should be
 * a JSON string of the service account credentials.
 */
function getFirebaseAdminApp(): App {
  // Return existing app if already initialized
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. " +
        "Please provide the Firebase service account credentials as a JSON string."
    );
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    return initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error) {
    throw new Error(
      `Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY: ${
        error instanceof Error ? error.message : "Invalid JSON"
      }`
    );
  }
}

// Initialize on module load
const adminApp = getFirebaseAdminApp();
const adminAuth = getAuth(adminApp);

/**
 * Verify a Firebase ID token and return the decoded token data.
 * Used in API routes to authenticate incoming requests.
 *
 * @param token - The Firebase ID token string from the client
 * @returns The decoded token containing uid, email, etc.
 * @throws Error if the token is invalid or expired
 */
export async function verifyIdToken(
  token: string
): Promise<DecodedIdToken> {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error(
      "Firebase token verification failed:",
      error instanceof Error ? error.message : error
    );
    throw new Error("Invalid or expired authentication token");
  }
}

export { adminApp, adminAuth };
