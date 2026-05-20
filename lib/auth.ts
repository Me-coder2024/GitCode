import { type NextRequest } from "next/server";
import { verifyIdToken } from "@/lib/firebase-admin";
import { supabaseAdmin } from "@/lib/supabase";
import type { User } from "@/types";

// ==========================================
// Server-Side Auth Helpers
// ==========================================

/**
 * Get the currently authenticated user from a request.
 *
 * Flow:
 * 1. Read the 'firebase-token' cookie from the request
 * 2. Verify the token with Firebase Admin SDK
 * 3. Look up the user in the Supabase 'users' table by firebase_uid
 * 4. Return the User object or null if not found/invalid
 *
 * @param request - The incoming Next.js request
 * @returns The authenticated User or null
 */
export async function getCurrentUser(
  request: NextRequest
): Promise<User | null> {
  try {
    // 1. Read the firebase-token cookie
    const token = request.cookies.get("firebase-token")?.value;

    if (!token) {
      return null;
    }

    // 2. Verify the token with Firebase Admin
    const decodedToken = await verifyIdToken(token);

    if (!decodedToken.uid) {
      return null;
    }

    // 3. Look up the user in Supabase by firebase_uid
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("firebase_uid", decodedToken.uid)
      .single();

    if (error || !user) {
      return null;
    }

    return user as User;
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}

/**
 * Check if a user has admin privileges.
 *
 * A user is considered an admin if:
 * - Their role is 'admin' in the database, OR
 * - Their email matches the ADMIN_EMAIL environment variable
 *
 * @param user - The User object to check
 * @returns true if the user is an admin
 */
export function isAdmin(user: User): boolean {
  if (user.role === "admin") {
    return true;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && user.email === adminEmail) {
    return true;
  }

  return false;
}
