import { logger } from "@v1/logger";
import { createClient } from "@v1/supabase/server";
import {
  User,
  Post,
  Customer,
  Subscription,
  Price,
  Product,
  UserWithPosts,
  SubscriptionWithUserAndPrice,
  ProductWithPrices,
} from "../types/db-types";
import { cookies } from "next/headers";
const supabase = createClient();
/**
 * Retrieves the currently authenticated user.
 * @returns The user data or null if not authenticated.
 */
export async function getUser(cookieStore?: ReturnType<typeof cookies>) {
  const supabase = createClient(cookieStore);
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    logger.error("Error fetching user:", error);
    throw error;
  }
}

/**
 * Retrieves all posts.
 * @returns An array of Post objects.
 */
export async function getPostsQuery(): Promise<Post[]> {
  try {
    const { data, error } = await supabase.from("posts").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    logger.error("Error fetching posts:", error);
    throw error;
  }
}

/**
 * Retrieves a specific post by its ID.
 * @param id The UUID of the post.
 * @returns The Post object or null if not found.
 */
export async function getPostByIdQuery(id: string): Promise<Post | null> {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    logger.error(`Error fetching post with id ${id}:`, error);
    throw error;
  }
}

/**
 * Retrieves all users.
 * @returns An array of User objects.
 */
export async function getUsersQuery(): Promise<User[]> {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    logger.error("Error fetching users:", error);
    throw error;
  }
}

/**
 * Retrieves a user by their ID, including their posts.
 * @param userId The UUID of the user.
 * @returns A UserWithPosts object or null if not found.
 */
export async function getUserWithPosts(
  userId: string,
): Promise<UserWithPosts | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(`
        *,
        posts (*)
      `)
      .eq("id", userId)
      .single();
    if (error) throw error;
    return data as UserWithPosts;
  } catch (error) {
    logger.error(`Error fetching user with posts for id ${userId}:`, error);
    throw error;
  }
}

/**
 * Retrieves all customers.
 * @returns An array of Customer objects.
 */
export async function getCustomersQuery(): Promise<Customer[]> {
  try {
    const { data, error } = await supabase.from("customers").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    logger.error("Error fetching customers:", error);
    throw error;
  }
}

/**
 * Retrieves a customer by their Stripe customer ID.
 * @param stripeCustomerId The Stripe customer ID.
 * @returns The Customer object or null if not found.
 */
export async function getCustomerByStripeIdQuery(
  stripeCustomerId: string,
): Promise<Customer | null> {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("stripe_customer_id", stripeCustomerId)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    logger.error(
      `Error fetching customer with Stripe ID ${stripeCustomerId}:`,
      error,
    );
    throw error;
  }
}

/**
 * Retrieves all subscriptions.
 * @returns An array of Subscription objects.
 */
export async function getSubscriptionsQuery(): Promise<Subscription[]> {
  try {
    const { data, error } = await supabase.from("subscriptions").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    logger.error("Error fetching subscriptions:", error);
    throw error;
  }
}

/**
 * Retrieves a subscription with associated user and price information.
 * @param subscriptionId The UUID of the subscription.
 * @returns A SubscriptionWithUserAndPrice object or null if not found.
 */
export async function getSubscriptionWithUserAndPriceQuery(
  subscriptionId: string,
): Promise<SubscriptionWithUserAndPrice | null> {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select(`
        *,
        user:users (*),
        price:prices (*)
      `)
      .eq("id", subscriptionId)
      .single();
    if (error) throw error;
    return data as SubscriptionWithUserAndPrice;
  } catch (error) {
    logger.error(
      `Error fetching subscription with user and price for id ${subscriptionId}:`,
      error,
    );
    throw error;
  }
}

/**
 * Retrieves all prices.
 * @returns An array of Price objects.
 */
export async function getPricesQuery(): Promise<Price[]> {
  try {
    const { data, error } = await supabase.from("prices").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    logger.error("Error fetching prices:", error);
    throw error;
  }
}

/**
 * Retrieves all active prices with their associated products.
 * @returns An array of Price objects with associated Product information.
 */
export async function getActivePricesWithProductsQuery(): Promise<
  (Price & { product: Product })[]
> {
  try {
    const { data, error } = await supabase
      .from("prices")
      .select(`
        *,
        product:products (*)
      `)
      .eq("active", true);
    if (error) throw error;
    return data as (Price & { product: Product })[];
  } catch (error) {
    logger.error("Error fetching active prices with products:", error);
    throw error;
  }
}

/**
 * Retrieves all products with their associated prices.
 * @returns An array of ProductWithPrices objects.
 */
export async function getProductsWithPricesQuery(): Promise<
  ProductWithPrices[]
> {
  try {
    const { data, error } = await supabase.from("products").select(`
        *,
        prices (*)
      `);
    if (error) throw error;
    return data as ProductWithPrices[];
  } catch (error) {
    logger.error("Error fetching products with prices:", error);
    throw error;
  }
}

export async function getUserQuery(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    logger.error(`Error fetching user with id ${userId}:`, error);
    return null;
  }
}
