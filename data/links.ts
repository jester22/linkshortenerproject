import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { links, type Link, type NewLink } from "@/db/schema";

/**
 * Fetches all links belonging to a specific user, ordered by updated date descending.
 *
 * @param userId - The Clerk user ID
 * @returns Array of links owned by the user
 */
export async function getLinksByUserId(userId: string): Promise<Link[]> {
  return db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.updatedAt));
}

/**
 * Creates a new shortened link in the database.
 *
 * @param data - The link data including url, slug, and userId
 * @returns The newly created link
 */
export async function createLink(
  data: Pick<NewLink, "url" | "slug" | "userId">,
): Promise<Link> {
  const [link] = await db.insert(links).values(data).returning();
  return link;
}

/**
 * Updates an existing link's URL and/or slug. Only updates if the link belongs to the given user.
 *
 * @param id - The link ID to update
 * @param userId - The Clerk user ID (ownership check)
 * @param data - The fields to update (url and/or slug)
 * @returns The updated link, or undefined if not found/not owned
 */
export async function updateLink(
  id: number,
  userId: string,
  data: Pick<NewLink, "url" | "slug">,
): Promise<Link | undefined> {
  const [updated] = await db
    .update(links)
    .set(data)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();
  return updated;
}

/**
 * Deletes a link by ID, only if it belongs to the given user.
 *
 * @param id - The link ID to delete
 * @param userId - The Clerk user ID (ownership check)
 * @returns The deleted link, or undefined if not found/not owned
 */
export async function deleteLink(
  id: number,
  userId: string,
): Promise<Link | undefined> {
  const [deleted] = await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();
  return deleted;
}

/**
 * Fetches a link by its slug.
 *
 * @param slug - The unique slug identifier
 * @returns The matching link, or undefined if not found
 */
export async function getLinkBySlug(slug: string): Promise<Link | undefined> {
  const [link] = await db.select().from(links).where(eq(links.slug, slug));
  return link;
}
