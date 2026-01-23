/**
 * Generates a URL-friendly slug from a string
 * @param text - The text to convert to a slug
 * @returns A URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

/**
 * Generates a unique course slug with instructor info
 * @param title - Course title
 * @param instructorName - Instructor name or role
 * @returns A unique slug like "anatomy-admin" or "cardiology-john-doe"
 */
export function generateCourseSlug(title: string, instructorName: string): string {
  const titleSlug = slugify(title);
  const instructorSlug = slugify(instructorName);
  return `${titleSlug}-${instructorSlug}`;
}
