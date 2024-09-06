import { Json, Tables, TablesInsert, TablesUpdate } from "./db";

/** Represents a nullable type */
export type Nullable<T> = T | null;

/** Represents a date string in ISO 8601 format */
export type DateString = string;

/** Represents a UUID string */
export type UUID = string;

// Base types
/** Represents a customer record from the 'customers' table */
export type Customer = Tables<"customers">;
/** Represents the data structure for inserting a new customer */
export type CustomerInsert = TablesInsert<"customers">;
/** Represents the data structure for updating a customer */
export type CustomerUpdate = TablesUpdate<"customers">;

/** Represents a post record from the 'posts' table */
export type Post = Tables<"posts">;
/** Represents the data structure for inserting a new post */
export type PostInsert = TablesInsert<"posts">;
/** Represents the data structure for updating a post */
export type PostUpdate = TablesUpdate<"posts">;

/** Represents a price record from the 'prices' table */
export type Price = Tables<"prices">;
/** Represents the data structure for inserting a new price */
export type PriceInsert = TablesInsert<"prices">;
/** Represents the data structure for updating a price */
export type PriceUpdate = TablesUpdate<"prices">;

/** Represents a product record from the 'products' table */
export type Product = Tables<"products">;
/** Represents the data structure for inserting a new product */
export type ProductInsert = TablesInsert<"products">;
/** Represents the data structure for updating a product */
export type ProductUpdate = TablesUpdate<"products">;

/** Represents a subscription record from the 'subscriptions' table */
export type Subscription = Tables<"subscriptions">;
/** Represents the data structure for inserting a new subscription */
export type SubscriptionInsert = TablesInsert<"subscriptions">;
/** Represents the data structure for updating a subscription */
export type SubscriptionUpdate = TablesUpdate<"subscriptions">;

/** Represents a user record from the 'users' table */
export type User = Tables<"users">;
/** Represents the data structure for inserting a new user */
export type UserInsert = TablesInsert<"users">;
/** Represents the data structure for updating a user */
export type UserUpdate = TablesUpdate<"users">;

// Enhanced types with more specific field definitions and joins

/** Enhanced user type with specific field definitions and optional related data */
export interface EnhancedUser extends User {
  id: UUID;
  email: string;
  full_name: Nullable<string>;
  avatar_url: Nullable<string>;
  billing_address: Nullable<Json>;
  payment_method: Nullable<Json>;
  created_at: Nullable<DateString>;
  updated_at: Nullable<DateString>;
  /** Optional array of user's posts */
  posts?: EnhancedPost[];
  /** Optional array of user's subscriptions */
  subscriptions?: EnhancedSubscription[];
  /** Optional customer information */
  customer?: EnhancedCustomer;
}

/** Enhanced post type with specific field definitions and optional related data */
export interface EnhancedPost extends Post {
  id: UUID;
  user_id: UUID;
  title: string;
  content: string;
  created_at: DateString;
  updated_at: DateString;
  /** Optional user who created the post */
  user?: EnhancedUser;
}

/** Enhanced subscription type with specific field definitions and optional related data */
export interface EnhancedSubscription extends Subscription {
  id: UUID;
  user_id: Nullable<UUID>;
  status: Nullable<
    | "trialing"
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "unpaid"
  >;
  price_id: Nullable<string>;
  quantity: Nullable<number>;
  cancel_at_period_end: Nullable<boolean>;
  created: DateString;
  current_period_start: Nullable<DateString>;
  current_period_end: Nullable<DateString>;
  ended_at: Nullable<DateString>;
  cancel_at: Nullable<DateString>;
  canceled_at: Nullable<DateString>;
  trial_start: Nullable<DateString>;
  trial_end: Nullable<DateString>;
  updated_at: Nullable<DateString>;
  /** Optional user associated with the subscription */
  user?: EnhancedUser;
  /** Optional price associated with the subscription */
  price?: EnhancedPrice;
}

/** Enhanced customer type with specific field definitions and optional related data */
export interface EnhancedCustomer extends Customer {
  id: UUID;
  stripe_customer_id: Nullable<string>;
  updated_at: Nullable<DateString>;
  /** Optional user associated with the customer */
  user?: EnhancedUser;
}

/** Enhanced price type with specific field definitions and optional related data */
export interface EnhancedPrice extends Price {
  id: UUID;
  product_id: Nullable<string>;
  active: Nullable<boolean>;
  description: Nullable<string>;
  unit_amount: Nullable<number>;
  currency: Nullable<string>;
  type: Nullable<string>;
  interval: Nullable<string>;
  interval_count: Nullable<number>;
  trial_period_days: Nullable<number>;
  metadata: Nullable<Json>;
  updated_at: Nullable<DateString>;
  /** Optional product associated with the price */
  product?: EnhancedProduct;
  /** Optional array of subscriptions using this price */
  subscriptions?: EnhancedSubscription[];
}

/** Enhanced product type with specific field definitions and optional related data */
export interface EnhancedProduct extends Product {
  id: UUID;
  active: Nullable<boolean>;
  name: Nullable<string>;
  description: Nullable<string>;
  image: Nullable<string>;
  metadata: Nullable<Json>;
  updated_at: Nullable<DateString>;
  /** Optional array of prices for this product */
  prices?: EnhancedPrice[];
}

// Join types

/** Represents a user with their posts */
export interface UserWithPosts extends EnhancedUser {
  posts: EnhancedPost[];
}

/** Represents a user with their subscriptions */
export interface UserWithSubscriptions extends EnhancedUser {
  subscriptions: EnhancedSubscription[];
}

/** Represents a post with its author */
export interface PostWithUser extends EnhancedPost {
  user: EnhancedUser;
}

/** Represents a subscription with associated user and price information */
export interface SubscriptionWithUserAndPrice extends EnhancedSubscription {
  user: EnhancedUser;
  price: EnhancedPrice;
}

/** Represents a price with its product and associated subscriptions */
export interface PriceWithProductAndSubscriptions extends EnhancedPrice {
  product: EnhancedProduct;
  subscriptions: EnhancedSubscription[];
}

/** Represents a product with its prices */
export interface ProductWithPrices extends EnhancedProduct {
  prices: EnhancedPrice[];
}

// New payment types

/** Represents a payment record from the 'payments' table */
export type Payment = Tables<"payments">;
/** Represents the data structure for inserting a new payment */
export type PaymentInsert = TablesInsert<"payments">;
/** Represents the data structure for updating a payment */
export type PaymentUpdate = TablesUpdate<"payments">;

/** Enhanced payment type with specific field definitions and optional related data */
export interface EnhancedPayment extends Payment {
  id: UUID;
  customer_id: UUID;
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: DateString;
  updated_at: Nullable<DateString>;
  /** Optional customer associated with the payment */
  customer?: EnhancedCustomer;
}

// Add to join types
/** Represents a payment with its associated customer */
export interface PaymentWithCustomer extends EnhancedPayment {
  customer: EnhancedCustomer;
}

/** Represents a customer with their payments */
export interface CustomerWithPayments extends EnhancedCustomer {
  payments: EnhancedPayment[];
}
