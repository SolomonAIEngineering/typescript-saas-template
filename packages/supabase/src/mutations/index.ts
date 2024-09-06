import { logger } from "@v1/logger";
import { createClient } from "@v1/supabase/server";
import type { Database, Tables, TablesUpdate } from "../types";
import { Post, User } from "../types/db-types";

export async function updateUser(userId: string, data: TablesUpdate<"users">) {
  const supabase = createClient();

  try {
    const result = await supabase.from("users").update(data).eq("id", userId);

    return result;
  } catch (error) {
    logger.error(error);

    throw error;
  }
}

/**
 * Updates a user's profile information.
 * @param userId The UUID of the user to update.
 * @param updates The partial User object containing the fields to update.
 * @returns The updated User object.
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<User>,
): Promise<User> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    logger.error(`Error updating user profile for id ${userId}:`, error);
    throw error;
  }
}

/**
 * Deletes a post by its ID.
 * @param postId The UUID of the post to delete.
 * @returns True if the post was successfully deleted, false otherwise.
 */
export async function deletePost(postId: string): Promise<boolean> {
  const supabase = createClient();

  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) throw error;
    return true;
  } catch (error) {
    logger.error(`Error deleting post with id ${postId}:`, error);
    return false;
  }
}

/**
 * Creates a new post.
 * @param post The post data to insert.
 * @returns The created Post object.
 */
export async function createPost(
  post: Omit<Post, "id" | "created_at" | "updated_at">,
): Promise<Post> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("posts")
      .insert(post)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    logger.error("Error creating post:", error);
    throw error;
  }
}
