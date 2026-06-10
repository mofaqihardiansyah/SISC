/**
 * Normalizes an image path to be used with Next.js Image component.
 * Handles Windows-style backslashes and missing leading slashes.
 */
import { ASSETS } from "@/lib/constants";

export function normalizeImagePath(path: string | null | undefined, fallback: string = ASSETS.PLACEHOLDER_BANNER): string {
  if (!path || path.trim() === "") {
    return fallback;
  }

  // If it's an absolute URL or data URL, return as is
  if (path.startsWith("http") || path.startsWith("data:")) {
    return path;
  }

  // Replace backslashes with forward slashes
  let normalized = path.replace(/\\/g, "/");

  // Ensure leading slash for relative paths
  if (!normalized.startsWith("/")) {
    normalized = "/" + normalized;
  }

  return normalized;
}
