import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

// ==========================================
// POST /api/teams/join
// Join a team by team_code
// ==========================================

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { team_code } = await request.json();

    if (!team_code || typeof team_code !== "string") {
      return NextResponse.json(
        { error: "team_code is required" },
        { status: 400 }
      );
    }

    // 1. Find team by team_code
    const { data: team, error: findError } = await supabaseAdmin
      .from("teams")
      .select("*")
      .eq("team_code", team_code.toUpperCase().trim())
      .single();

    if (findError || !team) {
      return NextResponse.json(
        { error: "Team not found. Please check the team code." },
        { status: 404 }
      );
    }

    // 2. Check if user is already a member
    const { data: existingMember } = await supabaseAdmin
      .from("team_members")
      .select("id")
      .eq("team_id", team.id)
      .eq("user_id", user.id)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: "You are already a member of this team" },
        { status: 409 }
      );
    }

    // 3. Check if team is full
    const { count: memberCount } = await supabaseAdmin
      .from("team_members")
      .select("*", { count: "exact", head: true })
      .eq("team_id", team.id);

    if (memberCount !== null && memberCount >= team.max_members) {
      return NextResponse.json(
        { error: "This team is full. Maximum members reached." },
        { status: 400 }
      );
    }

    // 4. Add user as member
    const { error: joinError } = await supabaseAdmin
      .from("team_members")
      .insert({
        team_id: team.id,
        user_id: user.id,
        role: "member",
      });

    if (joinError) {
      console.error("Error joining team:", joinError);
      return NextResponse.json(
        { error: "Failed to join team" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      team,
      message: "Successfully joined team",
    });
  } catch (error) {
    console.error("POST /api/teams/join error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
