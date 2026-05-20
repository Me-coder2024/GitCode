import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a random 6-character alphanumeric code (uppercase)
 */
export function generateTeamCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

/**
 * Generate a random 8-character join code for classrooms
 */
export function generateJoinCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

/**
 * Generate an invite link for a team
 */
export function generateInviteLink(teamCode: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${appUrl}/join/${teamCode}`;
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a date string to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(dateString);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get initials from a name
 */
export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Status color mapping
 */
export function getStatusColor(status: string): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case "assigned":
      return {
        bg: "bg-primary-light",
        text: "text-primary",
        border: "border-primary",
      };
    case "in_progress":
      return {
        bg: "bg-accent-yellow-light",
        text: "text-amber-700",
        border: "border-accent-yellow",
      };
    case "completed":
      return {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-500",
      };
    case "active":
      return {
        bg: "bg-primary-light",
        text: "text-primary",
        border: "border-primary",
      };
    case "archived":
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        border: "border-gray-400",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        border: "border-gray-400",
      };
  }
}

/**
 * Complexity color mapping for AI sections
 */
export function getComplexityColor(complexity: string): {
  bg: string;
  text: string;
} {
  switch (complexity) {
    case "easy":
      return { bg: "bg-green-100", text: "text-green-700" };
    case "medium":
      return { bg: "bg-amber-100", text: "text-amber-700" };
    case "hard":
      return { bg: "bg-red-100", text: "text-red-700" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700" };
  }
}

/**
 * Team color palette for assignment chips
 */
const TEAM_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
  { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-300" },
  { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300" },
  { bg: "bg-teal-100", text: "text-teal-700", border: "border-teal-300" },
  { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-300" },
  { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-300" },
  { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" },
  { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-300" },
  { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
];

export function getTeamColor(index: number) {
  return TEAM_COLORS[index % TEAM_COLORS.length];
}
