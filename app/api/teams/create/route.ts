import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";
import { generateTeamCode, generateInviteLink } from "@/lib/utils";

// ==========================================
// POST /api/teams/create
// Create a team & auto-assign project sections
// ==========================================

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { classroom_id, name, max_members } = await request.json();

    if (!classroom_id || !name) {
      return NextResponse.json(
        { error: "classroom_id and name are required" },
        { status: 400 }
      );
    }

    const team_code = generateTeamCode();
    const invite_link = generateInviteLink(team_code);

    // 1. Insert the team
    const { data: team, error: teamError } = await supabaseAdmin
      .from("teams")
      .insert({
        classroom_id,
        name,
        team_code,
        invite_link,
        max_members: max_members || 5,
        created_by: user.id,
      })
      .select("*")
      .single();

    if (teamError) {
      console.error("Error creating team:", teamError);
      return NextResponse.json(
        { error: "Failed to create team" },
        { status: 500 }
      );
    }

    // 2. Add creator as team leader
    const { error: memberError } = await supabaseAdmin
      .from("team_members")
      .insert({
        team_id: team.id,
        user_id: user.id,
        role: "leader",
      });

    if (memberError) {
      console.error("Error adding team leader:", memberError);
    }

    // 3. Auto-register to all active projects in this classroom
    try {
      // Get all active projects for the classroom
      const { data: projects } = await supabaseAdmin
        .from("projects")
        .select("id")
        .eq("classroom_id", classroom_id)
        .eq("status", "active");

      if (projects && projects.length > 0) {
        // Get total team count for this classroom (including the new team)
        const { count: teamCount } = await supabaseAdmin
          .from("teams")
          .select("*", { count: "exact", head: true })
          .eq("classroom_id", classroom_id);

        // Get all teams ordered by creation time to determine this team's index
        const { data: allTeams } = await supabaseAdmin
          .from("teams")
          .select("id")
          .eq("classroom_id", classroom_id)
          .order("created_at", { ascending: true });

        const totalTeams = teamCount || 1;
        const teamIndex =
          (allTeams || []).findIndex((t) => t.id === team.id);

        // For each project, assign sections via round-robin
        for (const project of projects) {
          const { data: sections } = await supabaseAdmin
            .from("project_sections")
            .select("id, section_order")
            .eq("project_id", project.id)
            .order("section_order", { ascending: true });

          if (sections && sections.length > 0) {
            const assignmentsToInsert = sections
              .filter(
                (section) =>
                  section.section_order % totalTeams === teamIndex
              )
              .map((section) => ({
                team_id: team.id,
                section_id: section.id,
                project_id: project.id,
                status: "assigned" as const,
              }));

            if (assignmentsToInsert.length > 0) {
              const { error: assignError } = await supabaseAdmin
                .from("team_section_assignments")
                .insert(assignmentsToInsert);

              if (assignError) {
                console.error(
                  "Error auto-assigning sections:",
                  assignError
                );
              }
            }
          }
        }
      }
    } catch (autoRegError) {
      // Don't fail team creation if auto-registration has issues
      console.error("Auto-registration error:", autoRegError);
    }

    return NextResponse.json(
      { team: { ...team, team_code, invite_link } },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/teams/create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
