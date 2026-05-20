import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import type { AdminStats } from "@/types";

// ==========================================
// GET /api/admin
// Fetch admin dashboard stats
// ==========================================

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdmin(user)) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Run all count queries in parallel
    const [studentsResult, teamsResult, projectsResult, sectionsResult] =
      await Promise.all([
        supabaseAdmin
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("role", "student"),
        supabaseAdmin
          .from("teams")
          .select("*", { count: "exact", head: true }),
        supabaseAdmin
          .from("projects")
          .select("*", { count: "exact", head: true }),
        supabaseAdmin
          .from("team_section_assignments")
          .select("*", { count: "exact", head: true })
          .neq("status", "completed"),
      ]);

    const stats: AdminStats = {
      total_students: studentsResult.count ?? 0,
      total_teams: teamsResult.count ?? 0,
      total_projects: projectsResult.count ?? 0,
      active_sections: sectionsResult.count ?? 0,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("GET /api/admin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
