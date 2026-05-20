import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import type { ConfirmSectionsRequest } from "@/types";

// ==========================================
// POST /api/groq/confirm-sections
// Persist AI-generated sections into the DB
// ==========================================

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdmin(user)) {
      return NextResponse.json(
        { error: "Only admins can create projects" },
        { status: 403 }
      );
    }

    const body: ConfirmSectionsRequest = await request.json();
    const {
      classroom_id,
      project_name,
      description,
      important_notes,
      git_link,
      ai_output,
    } = body;

    if (!classroom_id || !project_name || !git_link || !ai_output) {
      return NextResponse.json(
        {
          error:
            "classroom_id, project_name, git_link, and ai_output are required",
        },
        { status: 400 }
      );
    }

    // 1. Insert the project
    const { data: project, error: projectError } = await supabaseAdmin
      .from("projects")
      .insert({
        classroom_id,
        name: project_name,
        description: description || null,
        important_notes: important_notes || null,
        git_link,
        status: "active",
        created_by: user.id,
      })
      .select("*")
      .single();

    if (projectError || !project) {
      console.error("Error creating project:", projectError);
      return NextResponse.json(
        { error: "Failed to create project" },
        { status: 500 }
      );
    }

    // 2. Get all teams in the classroom (ordered by creation for stable indexing)
    const { data: teams } = await supabaseAdmin
      .from("teams")
      .select("id")
      .eq("classroom_id", classroom_id)
      .order("created_at", { ascending: true });

    const teamList = teams || [];

    // 3. Insert pages, sections, and assignments
    let sectionGlobalOrder = 0;

    for (let pageIndex = 0; pageIndex < ai_output.pages.length; pageIndex++) {
      const pageData = ai_output.pages[pageIndex];

      // Insert page
      const { data: page, error: pageError } = await supabaseAdmin
        .from("project_pages")
        .insert({
          project_id: project.id,
          page_name: pageData.page_name,
          page_description: pageData.page_description || null,
          page_order: pageIndex,
        })
        .select("*")
        .single();

      if (pageError || !page) {
        console.error("Error creating page:", pageError);
        continue;
      }

      // Insert sections for this page
      for (let sIdx = 0; sIdx < pageData.sections.length; sIdx++) {
        const sectionData = pageData.sections[sIdx];

        const { data: section, error: sectionError } = await supabaseAdmin
          .from("project_sections")
          .insert({
            page_id: page.id,
            project_id: project.id,
            section_name: sectionData.section_name,
            section_description: sectionData.section_description || null,
            section_order: sectionGlobalOrder,
            ui_hints: sectionData.ui_hints || null,
          })
          .select("*")
          .single();

        if (sectionError || !section) {
          console.error("Error creating section:", sectionError);
          sectionGlobalOrder++;
          continue;
        }

        // Assign section to team based on assigned_team_index
        if (teamList.length > 0) {
          const assignedTeam =
            teamList[sectionData.assigned_team_index % teamList.length];

          const { error: assignError } = await supabaseAdmin
            .from("team_section_assignments")
            .insert({
              team_id: assignedTeam.id,
              section_id: section.id,
              project_id: project.id,
              status: "assigned",
            });

          if (assignError) {
            console.error("Error assigning section:", assignError);
          }
        }

        sectionGlobalOrder++;
      }
    }

    return NextResponse.json(
      {
        project,
        message: "Project created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/groq/confirm-sections error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
