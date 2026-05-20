import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { generateJoinCode } from "@/lib/utils";

// ==========================================
// GET /api/classrooms
// Fetch classrooms for the current user
// ==========================================

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // --- Single classroom by ID ---
    if (id) {
      const { data: classroom, error: classroomError } = await supabaseAdmin
        .from("classrooms")
        .select("*")
        .eq("id", id)
        .single();

      if (classroomError || !classroom) {
        return NextResponse.json(
          { error: "Classroom not found" },
          { status: 404 }
        );
      }

      // Member count
      const { count: memberCount } = await supabaseAdmin
        .from("classroom_members")
        .select("*", { count: "exact", head: true })
        .eq("classroom_id", id);

      // Teams with member counts
      const { data: teams } = await supabaseAdmin
        .from("teams")
        .select("*, team_members(count)")
        .eq("classroom_id", id);

      const teamsWithCount = (teams || []).map((team) => ({
        ...team,
        member_count: (team.team_members as { count: number }[])?.[0]?.count ?? 0,
        team_members: undefined,
      }));

      // Projects
      const { data: projects } = await supabaseAdmin
        .from("projects")
        .select("*")
        .eq("classroom_id", id)
        .order("created_at", { ascending: false });

      return NextResponse.json({
        classroom: { ...classroom, member_count: memberCount ?? 0 },
        teams: teamsWithCount,
        projects: projects || [],
      });
    }

    // --- All classrooms for current user ---
    const { data: memberships, error: memberError } = await supabaseAdmin
      .from("classroom_members")
      .select("classroom_id")
      .eq("user_id", user.id);

    if (memberError) {
      console.error("Error fetching memberships:", memberError);
      return NextResponse.json(
        { error: "Failed to fetch classrooms" },
        { status: 500 }
      );
    }

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({ classrooms: [] });
    }

    const classroomIds = memberships.map((m) => m.classroom_id);

    const { data: classrooms, error: classroomsError } = await supabaseAdmin
      .from("classrooms")
      .select("*, classroom_members(count)")
      .in("id", classroomIds)
      .order("created_at", { ascending: false });

    if (classroomsError) {
      console.error("Error fetching classrooms:", classroomsError);
      return NextResponse.json(
        { error: "Failed to fetch classrooms" },
        { status: 500 }
      );
    }

    const classroomsWithCount = (classrooms || []).map((c) => ({
      ...c,
      member_count: (c.classroom_members as { count: number }[])?.[0]?.count ?? 0,
      classroom_members: undefined,
    }));

    return NextResponse.json({ classrooms: classroomsWithCount });
  } catch (error) {
    console.error("GET /api/classrooms error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ==========================================
// POST /api/classrooms
// Create or join a classroom
// ==========================================

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    // --- Create Classroom ---
    if (action === "create") {
      if (!isAdmin(user)) {
        return NextResponse.json(
          { error: "Only admins can create classrooms" },
          { status: 403 }
        );
      }

      const { name, description } = body;

      if (!name || typeof name !== "string") {
        return NextResponse.json(
          { error: "Classroom name is required" },
          { status: 400 }
        );
      }

      const join_code = generateJoinCode();

      const { data: classroom, error: insertError } = await supabaseAdmin
        .from("classrooms")
        .insert({
          name,
          description: description || null,
          join_code,
          created_by: user.id,
        })
        .select("*")
        .single();

      if (insertError) {
        console.error("Error creating classroom:", insertError);
        return NextResponse.json(
          { error: "Failed to create classroom" },
          { status: 500 }
        );
      }

      // Add creator as a member
      const { error: memberError } = await supabaseAdmin
        .from("classroom_members")
        .insert({
          classroom_id: classroom.id,
          user_id: user.id,
        });

      if (memberError) {
        console.error("Error adding creator as member:", memberError);
        // Classroom was created, so we still return it
      }

      return NextResponse.json({ classroom }, { status: 201 });
    }

    // --- Join Classroom ---
    if (action === "join") {
      const { join_code } = body;

      if (!join_code || typeof join_code !== "string") {
        return NextResponse.json(
          { error: "Join code is required" },
          { status: 400 }
        );
      }

      // Find classroom by join_code
      const { data: classroom, error: findError } = await supabaseAdmin
        .from("classrooms")
        .select("*")
        .eq("join_code", join_code.toUpperCase().trim())
        .single();

      if (findError || !classroom) {
        return NextResponse.json(
          { error: "Invalid join code. Classroom not found." },
          { status: 404 }
        );
      }

      // Check if user is already a member
      const { data: existingMember } = await supabaseAdmin
        .from("classroom_members")
        .select("id")
        .eq("classroom_id", classroom.id)
        .eq("user_id", user.id)
        .single();

      if (existingMember) {
        return NextResponse.json(
          { error: "You are already a member of this classroom" },
          { status: 409 }
        );
      }

      // Add user as member
      const { error: joinError } = await supabaseAdmin
        .from("classroom_members")
        .insert({
          classroom_id: classroom.id,
          user_id: user.id,
        });

      if (joinError) {
        console.error("Error joining classroom:", joinError);
        return NextResponse.json(
          { error: "Failed to join classroom" },
          { status: 500 }
        );
      }

      return NextResponse.json({ classroom }, { status: 200 });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'create' or 'join'." },
      { status: 400 }
    );
  } catch (error) {
    console.error("POST /api/classrooms error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
