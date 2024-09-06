import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createClient } from "@v1/supabase/server";
import { logger } from "@v1/logger";
import {
  User,
  Post,
  Customer,
  Subscription,
  Price,
  Product,
  UserWithPosts,
  UserWithSubscriptions,
  SubscriptionWithUserAndPrice,
  ProductWithPrices,
} from "../types/db-types";
import {
  getActivePricesWithProductsQuery,
  getCustomerByStripeIdQuery,
  getCustomersQuery,
  getPostByIdQuery,
  getPostsQuery,
  getPricesQuery,
  getProductsWithPricesQuery,
  getSubscriptionsQuery,
  getSubscriptionWithUserAndPriceQuery,
  getUser,
  getUserQuery,
  getUsersQuery,
} from "./queries";

const supabase = createClient();

/**
 * Cached function to get user subscriptions
 * @param invalidateCache Whether to bypass the cache
 * @returns User subscriptions or null if user is not authenticated
 */
export const getCachedUserSubscriptions = cache(
  async (invalidateCache = false) => {
    const user = await getUser();
    const userId = user?.id;

    if (!userId) {
      return null;
    }

    if (invalidateCache) {
      return getUserSubscriptionsQuery(userId);
    }

    return unstable_cache(
      async () => getUserSubscriptionsQuery(userId),
      ["user", "subscriptions", userId],
      {
        tags: [`user_subscriptions_${userId}`],
        revalidate: 180,
      },
    )();
  },
);

async function getUserSubscriptionsQuery(
  userId: string,
): Promise<SubscriptionWithUserAndPrice[] | null> {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select(`
        *,
        user:users (*),
        price:prices (*, product:products (*))
      `)
      .eq("user_id", userId);
    if (error) throw error;
    return data as SubscriptionWithUserAndPrice[];
  } catch (error) {
    logger.error(`Error fetching subscriptions for user ${userId}:`, error);
    return null;
  }
}

/**
 * Cached function to get user with posts
 * @param userId The user ID
 * @param invalidateCache Whether to bypass the cache
 * @returns User with posts or null if not found
 */
export const getCachedUserWithPosts = cache(
  async (userId: string, invalidateCache = false) => {
    if (invalidateCache) {
      return getUserWithPostsQuery(userId);
    }

    return unstable_cache(
      async () => getUserWithPostsQuery(userId),
      ["user", "posts", userId],
      {
        tags: [`user_posts_${userId}`],
        revalidate: 60,
      },
    )();
  },
);

async function getUserWithPostsQuery(
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
    return null;
  }
}

/**
 * Cached function to get all posts
 * @param invalidateCache Whether to bypass the cache
 * @returns Array of posts
 */
export const getCachedPosts = cache(async (invalidateCache = false) => {
  if (invalidateCache) {
    return getPostsQuery();
  }

  return unstable_cache(async () => getPostsQuery(), ["posts"], {
    tags: ["all_posts"],
    revalidate: 300,
  })();
});

/**
 * Cached function to get a specific post by ID
 * @param postId The post ID
 * @param invalidateCache Whether to bypass the cache
 * @returns Post object or null if not found
 */
export const getCachedPostById = cache(
  async (postId: string, invalidateCache = false) => {
    if (invalidateCache) {
      return getPostByIdQuery(postId);
    }

    return unstable_cache(
      async () => getPostByIdQuery(postId),
      ["post", postId],
      {
        tags: [`post_${postId}`],
        revalidate: 60,
      },
    )();
  },
);

/**
 * Cached function to get all users
 * @param invalidateCache Whether to bypass the cache
 * @returns Array of users
 */
export const getCachedUsers = cache(async (invalidateCache = false) => {
  if (invalidateCache) {
    return getUsersQuery();
  }

  return unstable_cache(async () => getUsersQuery(), ["users"], {
    tags: ["all_users"],
    revalidate: 300,
  })();
});

/**
 * Cached function to get all customers
 * @param invalidateCache Whether to bypass the cache
 * @returns Array of customers
 */
export const getCachedCustomers = cache(async (invalidateCache = false) => {
  if (invalidateCache) {
    return getCustomersQuery();
  }

  return unstable_cache(async () => getCustomersQuery(), ["customers"], {
    tags: ["all_customers"],
    revalidate: 300,
  })();
});

/**
 * Cached function to get a customer by Stripe ID
 * @param stripeCustomerId The Stripe customer ID
 * @param invalidateCache Whether to bypass the cache
 * @returns Customer object or null if not found
 */
export const getCachedCustomerByStripeId = cache(
  async (stripeCustomerId: string, invalidateCache = false) => {
    if (invalidateCache) {
      return getCustomerByStripeIdQuery(stripeCustomerId);
    }

    return unstable_cache(
      async () => getCustomerByStripeIdQuery(stripeCustomerId),
      ["customer", "stripe", stripeCustomerId],
      {
        tags: [`customer_stripe_${stripeCustomerId}`],
        revalidate: 60,
      },
    )();
  },
);

/**
 * Cached function to get all subscriptions
 * @param invalidateCache Whether to bypass the cache
 * @returns Array of subscriptions
 */
export const getCachedSubscriptions = cache(async (invalidateCache = false) => {
  if (invalidateCache) {
    return getSubscriptionsQuery();
  }

  return unstable_cache(
    async () => getSubscriptionsQuery(),
    ["subscriptions"],
    {
      tags: ["all_subscriptions"],
      revalidate: 300,
    },
  )();
});

/**
 * Cached function to get a subscription with user and price information
 * @param subscriptionId The subscription ID
 * @param invalidateCache Whether to bypass the cache
 * @returns SubscriptionWithUserAndPrice object or null if not found
 */
export const getCachedSubscriptionWithUserAndPrice = cache(
  async (subscriptionId: string, invalidateCache = false) => {
    if (invalidateCache) {
      return getSubscriptionWithUserAndPriceQuery(subscriptionId);
    }

    return unstable_cache(
      async () => getSubscriptionWithUserAndPriceQuery(subscriptionId),
      ["subscription", "user", "price", subscriptionId],
      {
        tags: [`subscription_${subscriptionId}`],
        revalidate: 60,
      },
    )();
  },
);

/**
 * Cached function to get all prices
 * @param invalidateCache Whether to bypass the cache
 * @returns Array of prices
 */
export const getCachedPrices = cache(async (invalidateCache = false) => {
  if (invalidateCache) {
    return getPricesQuery();
  }

  return unstable_cache(async () => getPricesQuery(), ["prices"], {
    tags: ["all_prices"],
    revalidate: 3600,
  })();
});
/**
 * Cached function to get all active prices with their associated products
 * @param invalidateCache Whether to bypass the cache
 * @returns Array of Price objects with associated Product information
 */
export const getCachedActivePricesWithProducts = cache(
  async (invalidateCache = false) => {
    if (invalidateCache) {
      return getActivePricesWithProductsQuery();
    }

    return unstable_cache(
      async () => getActivePricesWithProductsQuery(),
      ["active_prices", "products"],
      {
        tags: ["active_prices_with_products"],
        revalidate: 3600,
      },
    )();
  },
);

/**
 * Cached function to get all products with prices
 * @param invalidateCache Whether to bypass the cache
 * @returns Array of products with prices
 */
export const getCachedProductsWithPrices = cache(
  async (invalidateCache = false) => {
    if (invalidateCache) {
      return getProductsWithPricesQuery();
    }

    return unstable_cache(
      async () => getProductsWithPricesQuery(),
      ["products", "prices"],
      {
        tags: ["products_with_prices"],
        revalidate: 3600,
      },
    )();
  },
);

/**
 * Cached function to get a user by ID
 * @param userId The user ID
 * @param invalidateCache Whether to bypass the cache
 * @returns User object or null if not found
 */
export const getCachedUser = cache(
  async (userId: string, invalidateCache = false) => {
    if (invalidateCache) {
      return getUserQuery(userId);
    }

    return unstable_cache(async () => getUserQuery(userId), ["user", userId], {
      tags: [`user_${userId}`],
      revalidate: 60,
    })();
  },
);

/**
 * Cached function to get the authenticated user
 * @param invalidateCache Whether to bypass the cache
 * @returns User object or null if not found
 */
export const getCachedAuthenticatedUser = cache(
  async (invalidateCache = false) => {
    if (invalidateCache) {
      return getUser();
    }

    return unstable_cache(async () => getUser(), ["user"], {
      revalidate: 3600,
    });
  },
);
