import Groq from "groq-sdk";
import type { AIGeneratedOutput } from "@/types";

// ==========================================
// Groq AI Client
// ==========================================

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * System prompt that instructs the AI to generate project sections.
 */
const SYSTEM_PROMPT = `You are a project manager AI. Given a project name, description, important notes, and team count, generate a structured list of pages and sections for a web project. Each team will be assigned one or more sections to build collaboratively.

Rules:
- Generate pages appropriate for the project type
- Each page has 2-5 sections
- Distribute sections evenly across teams
- Each section has: name, description, UI hints, estimated complexity
- Return ONLY valid JSON in the exact format below, with NO markdown, NO code fences, NO extra text

Format:
{
  "pages": [
    {
      "page_name": "Page Name",
      "page_description": "What this page does",
      "sections": [
        {
          "section_name": "Section Name",
          "section_description": "What this section contains and its purpose",
          "ui_hints": "Suggested UI components, layout, and styling notes",
          "complexity": "easy | medium | hard",
          "assigned_team_index": 0
        }
      ]
    }
  ],
  "summary": "Brief overview of the generated project structure"
}`;

/**
 * Generate project pages and sections using Groq AI.
 *
 * @param projectName - The name of the project
 * @param description - A description of what the project is about
 * @param notes - Important notes or requirements for the project
 * @param teamCount - The number of teams to distribute sections across
 * @returns Typed AI-generated output with pages, sections, and summary
 */
export async function generateProjectSections(
  projectName: string,
  description: string,
  notes: string,
  teamCount: number
): Promise<AIGeneratedOutput> {
  const userPrompt = `Project Name: ${projectName}
Description: ${description}
Important Notes: ${notes}
Number of Teams: ${teamCount}

Generate the project structure now. Remember to distribute sections evenly across ${teamCount} teams (team indices 0 to ${teamCount - 1}).`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("No response content received from Groq AI");
    }

    // Clean the response — strip markdown code fences if present
    const cleanedContent = responseContent
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    const parsed: AIGeneratedOutput = JSON.parse(cleanedContent);

    // Validate the structure
    if (!parsed.pages || !Array.isArray(parsed.pages)) {
      throw new Error("AI response missing 'pages' array");
    }

    if (!parsed.summary || typeof parsed.summary !== "string") {
      parsed.summary = "Project structure generated successfully.";
    }

    // Validate and clamp team indices
    for (const page of parsed.pages) {
      if (!page.sections || !Array.isArray(page.sections)) {
        throw new Error(
          `Page "${page.page_name}" is missing 'sections' array`
        );
      }

      for (const section of page.sections) {
        // Ensure assigned_team_index is within valid range
        if (
          typeof section.assigned_team_index !== "number" ||
          section.assigned_team_index < 0 ||
          section.assigned_team_index >= teamCount
        ) {
          section.assigned_team_index =
            section.assigned_team_index != null
              ? Math.abs(section.assigned_team_index) % teamCount
              : 0;
        }

        // Ensure complexity is valid
        if (!["easy", "medium", "hard"].includes(section.complexity)) {
          section.complexity = "medium";
        }
      }
    }

    return parsed;
  } catch (error) {
    console.error("Groq AI generation failed:", error);

    if (error instanceof SyntaxError) {
      throw new Error(
        "Failed to parse AI response as JSON. The AI may have returned an invalid format."
      );
    }

    throw error;
  }
}

export { groq };
