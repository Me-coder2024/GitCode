import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { generateProjectSections } from "@/lib/groq";
import type { AIGeneratedOutput } from "@/types";

// ==========================================
// POST /api/groq/generate-sections
// Generate project sections using Groq AI
// ==========================================

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { project_name, description, important_notes, team_count } =
      await request.json();

    if (!project_name || !description) {
      return NextResponse.json(
        { error: "project_name and description are required" },
        { status: 400 }
      );
    }

    if (!team_count || typeof team_count !== "number" || team_count < 1) {
      return NextResponse.json(
        { error: "team_count must be a positive number" },
        { status: 400 }
      );
    }

    const output: AIGeneratedOutput = await generateProjectSections(
      project_name,
      description,
      important_notes || "",
      team_count
    );

    return NextResponse.json({ output });
  } catch (error) {
    console.error("POST /api/groq/generate-sections error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate project sections",
      },
      { status: 500 }
    );
  }
}
