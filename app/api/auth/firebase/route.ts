import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/firebase-admin";
import { supabaseAdmin } from "@/lib/supabase";

// ==========================================
// POST /api/auth/firebase
// Verify Firebase token & upsert user
// ==========================================

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid token" },
        { status: 400 }
      );
    }

    // 1. Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await verifyIdToken(token);
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired authentication token" },
        { status: 401 }
      );
    }

    const { uid, email, displayName, photoURL } = decodedToken as {
      uid: string;
      email?: string;
      displayName?: string;
      photoURL?: string;
    };

    if (!email) {
      return NextResponse.json(
        { error: "Email not found in token" },
        { status: 400 }
      );
    }

    const name = displayName || null;
    const avatar_url = photoURL || null;
    const adminEmail = process.env.ADMIN_EMAIL;

    // 2. Check if user already exists by firebase_uid
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("firebase_uid", uid)
      .single();

    let user;

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = "no rows found" — anything else is a real error
      console.error("Error fetching user:", fetchError);
      return NextResponse.json(
        { error: "Database error while looking up user" },
        { status: 500 }
      );
    }

    if (existingUser) {
      // 3a. User exists — update name & avatar
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from("users")
        .update({ name, avatar_url })
        .eq("firebase_uid", uid)
        .select("*")
        .single();

      if (updateError) {
        console.error("Error updating user:", updateError);
        return NextResponse.json(
          { error: "Failed to update user" },
          { status: 500 }
        );
      }

      user = updatedUser;
    } else {
      // 3b. New user — insert
      const role =
        adminEmail && email === adminEmail ? "admin" : "student";

      const { data: newUser, error: insertError } = await supabaseAdmin
        .from("users")
        .insert({
          firebase_uid: uid,
          email,
          name,
          avatar_url,
          role,
        })
        .select("*")
        .single();

      if (insertError) {
        console.error("Error inserting user:", insertError);
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        );
      }

      user = newUser;
    }

    // 4. Build response with cookie
    const response = NextResponse.json({ user }, { status: 200 });

    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("firebase-token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("POST /api/auth/firebase error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ==========================================
// DELETE /api/auth/firebase
// Clear session cookie upon logout
// ==========================================

export async function DELETE() {
  try {
    const response = NextResponse.json(
      { message: "Signed out successfully" },
      { status: 200 }
    );

    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set("firebase-token", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 0, // Immediately expire the cookie
    });

    return response;
  } catch (error) {
    console.error("DELETE /api/auth/firebase error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
