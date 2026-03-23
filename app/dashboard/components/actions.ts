"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createLink, updateLink, deleteLink } from "@/data/links";

const CreateLinkSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be at most 50 characters")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "Slug can only contain letters, numbers, and hyphens"
    ),
});

type CreateLinkInput = z.infer<typeof CreateLinkSchema>;

/**
 * Server action to create a new shortened link.
 *
 * @param input - The link URL and custom slug
 * @returns Object with either `data` (the created link) or `error` (validation/auth error)
 */
export async function createLinkAction(
  input: CreateLinkInput
): Promise<{ data?: { id: number; slug: string }; error?: string }> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  const parsed = CreateLinkSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError =
      fieldErrors.url?.[0] ?? fieldErrors.slug?.[0] ?? "Invalid input";
    return { error: firstError };
  }

  try {
    const link = await createLink({ ...parsed.data, userId });
    revalidatePath("/dashboard");
    return { data: { id: link.id, slug: link.slug } };
  } catch {
    return { error: "A link with this slug already exists. Please choose another." };
  }
}

const UpdateLinkSchema = z.object({
  id: z.number().int().positive(),
  url: z.string().url("Please enter a valid URL"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be at most 50 characters")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "Slug can only contain letters, numbers, and hyphens"
    ),
});

type UpdateLinkInput = z.infer<typeof UpdateLinkSchema>;

/**
 * Server action to update an existing shortened link.
 *
 * @param input - The link ID, new URL, and new slug
 * @returns Object with either `data` (success flag) or `error`
 */
export async function updateLinkAction(
  input: UpdateLinkInput
): Promise<{ data?: { id: number; slug: string }; error?: string }> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  const parsed = UpdateLinkSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    const firstError =
      fieldErrors.url?.[0] ?? fieldErrors.slug?.[0] ?? "Invalid input";
    return { error: firstError };
  }

  try {
    const updated = await updateLink(parsed.data.id, userId, {
      url: parsed.data.url,
      slug: parsed.data.slug,
    });

    if (!updated) {
      return { error: "Link not found or you do not have permission to edit it." };
    }

    revalidatePath("/dashboard");
    return { data: { id: updated.id, slug: updated.slug } };
  } catch {
    return { error: "A link with this slug already exists. Please choose another." };
  }
}

const DeleteLinkSchema = z.object({
  id: z.number().int().positive(),
});

type DeleteLinkInput = z.infer<typeof DeleteLinkSchema>;

/**
 * Server action to delete a shortened link.
 *
 * @param input - Object containing the link ID to delete
 * @returns Object with either `data` (success flag) or `error`
 */
export async function deleteLinkAction(
  input: DeleteLinkInput
): Promise<{ data?: { success: boolean }; error?: string }> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  const parsed = DeleteLinkSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Invalid link ID" };
  }

  try {
    const deleted = await deleteLink(parsed.data.id, userId);

    if (!deleted) {
      return { error: "Link not found or you do not have permission to delete it." };
    }

    revalidatePath("/dashboard");
    return { data: { success: true } };
  } catch {
    return { error: "Failed to delete link" };
  }
}
