import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

// ==========================================
// GET /api/projects
// Fetch project(s) with details
// ==========================================

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const classroomId = searchParams.get("classroomId");

    // --- Single project by ID ---
    if (id) {
      const { data: project, error: projectError } = await supabaseAdmin
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (projectError || !project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      // Fetch pages with sections
      const { data: pages } = await supabaseAdmin
        .from("project_pages")
        .select("*")
        .eq("project_id", id)
        .order("page_order", { ascending: true });

      // Fetch sections with page info
      const { data: sections } = await supabaseAdmin
        .from("project_sections")
        .select("*, page:project_pages(*)")
        .eq("project_id", id)
        .order("section_order", { ascending: true });

      // Fetch assignments with team details
      const { data: assignments } = await supabaseAdmin
        .from("team_section_assignments")
        .select("*, team:teams(*), section:project_sections(*)")
        .eq("project_id", id);

      // Nest sections under their pages
      const pagesWithSections = (pages || []).map((page) => ({
        ...page,
        sections: (sections || []).filter((s) => s.page_id === page.id),
      }));

      return NextResponse.json({
        project,
        pages: pagesWithSections,
        assignments: assignments || [],
      });
    }

    // --- All projects for a classroom ---
    if (classroomId) {
      const { data: projects, error: projectsError } = await supabaseAdmin
        .from("projects")
        .select(
          "*, project_sections(count), team_section_assignments(count)"
        )
        .eq("classroom_id", classroomId)
        .order("created_at", { ascending: false });

      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
        return NextResponse.json(
          { error: "Failed to fetch projects" },
          { status: 500 }
        );
      }

      const projectsWithCounts = (projects || []).map((p) => ({
        ...p,
        section_count:
          (p.project_sections as { count: number }[])?.[0]?.count ?? 0,
        team_count:
          (p.team_section_assignments as { count: number }[])?.[0]?.count ?? 0,
        project_sections: undefined,
        team_section_assignments: undefined,
      }));

      return NextResponse.json({ projects: projectsWithCounts });
    }

    return NextResponse.json(
      { error: "Provide either 'id' or 'classroomId' query parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ==========================================
// PATCH /api/projects
// Update a team section assignment status
// ==========================================

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { assignment_id, status } = await request.json();

    if (!assignment_id) {
      return NextResponse.json(
        { error: "assignment_id is required" },
        { status: 400 }
      );
    }

    const validStatuses = ["assigned", "in_progress", "completed"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const { data: assignment, error: updateError } = await supabaseAdmin
      .from("team_section_assignments")
      .update({ status })
      .eq("id", assignment_id)
      .select("*")
      .single();

    if (updateError || !assignment) {
      console.error("Error updating assignment:", updateError);
      return NextResponse.json(
        { error: "Failed to update assignment status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ assignment });
  } catch (error) {
    console.error("PATCH /api/projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
