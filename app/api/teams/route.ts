import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

// ==========================================
// GET /api/teams?classroomId=...
// Fetch all teams for a classroom
// ==========================================

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const classroomId = searchParams.get("classroomId");

    if (!classroomId) {
      return NextResponse.json(
        { error: "classroomId query parameter is required" },
        { status: 400 }
      );
    }

    // Fetch teams with member count
    const { data: teams, error: teamsError } = await supabaseAdmin
      .from("teams")
      .select("*, team_members(count)")
      .eq("classroom_id", classroomId)
      .order("created_at", { ascending: true });

    if (teamsError) {
      console.error("Error fetching teams:", teamsError);
      return NextResponse.json(
        { error: "Failed to fetch teams" },
        { status: 500 }
      );
    }

    // Fetch members with user details for each team
    const teamIds = (teams || []).map((t) => t.id);

    let membersMap: Record<string, Array<Record<string, unknown>>> = {};

    if (teamIds.length > 0) {
      const { data: allMembers, error: membersError } = await supabaseAdmin
        .from("team_members")
        .select("*, user:users(*)")
        .in("team_id", teamIds)
        .order("joined_at", { ascending: true });

      if (membersError) {
        console.error("Error fetching team members:", membersError);
      } else {
        // Group members by team_id
        membersMap = (allMembers || []).reduce(
          (acc, member) => {
            const tid = member.team_id as string;
            if (!acc[tid]) acc[tid] = [];
            acc[tid].push(member);
            return acc;
          },
          {} as Record<string, Array<Record<string, unknown>>>
        );
      }
    }

    // Combine teams with member counts and members
    const teamsWithDetails = (teams || []).map((team) => ({
      ...team,
      member_count:
        (team.team_members as { count: number }[])?.[0]?.count ?? 0,
      members: membersMap[team.id] || [],
      team_members: undefined,
    }));

    return NextResponse.json({ teams: teamsWithDetails });
  } catch (error) {
    console.error("GET /api/teams error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
