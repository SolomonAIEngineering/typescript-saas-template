import { POST as customerRoute } from "./api/customer";
import {
  POST as subscriptionRoute,
  PATCH as manageSubscriptionRoute,
} from "./api/subscription";
import { POST as paymentIntentRoute } from "./api/payment-intent";
import { POST as checkoutRoute } from "./api/checkout";
import { POST as webhookRoute } from "./webhooks/stripe";
import { cookies } from "next/headers";

/**
 * Wraps a request handler function with cookie access.
 * @param handler - The original request handler function
 * @returns A new function that handles the request and provides cookie access
 * @example
 * const wrappedHandler = withCookies(originalHandler);
 * // Use wrappedHandler in your API route
 */
export function withCookies(handler: Function) {
  return async (req: Request, res: Response) => {
    const cookieStore = cookies();
    return handler(req, res, cookieStore);
  };
}

/**
 * Object containing wrapped API route handlers with cookie access.
 * @example
 * // In your API route file (e.g., app/api/stripe/customer/route.js):
 * import { routes } from '../../../../src/routes';
 * export const POST = routes.customer;
 */
export const routes = {
  /**
   * Wrapped customer route handler
   * @example
   * // POST /api/stripe/customer
   * const response = await fetch('/api/stripe/customer', {
   *   method: 'POST',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify({ email: 'user@example.com', name: 'John Doe' })
   * });
   */
  customer: withCookies(customerRoute),

  /**
   * Wrapped subscription route handler
   * @example
   * // POST /api/stripe/subscription
   * const response = await fetch('/api/stripe/subscription', {
   *   method: 'POST',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify({ priceId: 'price_1234', customerId: 'cus_5678' })
   * });
   */
  subscription: withCookies(subscriptionRoute),

  /**
   * Wrapped manage subscription route handler
   * @example
   * // PATCH /api/stripe/subscription
   * const response = await fetch('/api/stripe/subscription', {
   *   method: 'PATCH',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify({ subscriptionId: 'sub_1234', action: 'cancel' })
   * });
   */
  manageSubscription: withCookies(manageSubscriptionRoute),

  /**
   * Wrapped payment intent route handler
   * @example
   * // POST /api/stripe/payment-intent
   * const response = await fetch('/api/stripe/payment-intent', {
   *   method: 'POST',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify({ amount: 1000, currency: 'usd' })
   * });
   */
  paymentIntent: withCookies(paymentIntentRoute),

  /**
   * Wrapped checkout route handler
   * @example
   * // POST /api/stripe/checkout
   * const response = await fetch('/api/stripe/checkout', {
   *   method: 'POST',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify({ priceId: 'price_1234' })
   * });
   */
  checkout: withCookies(checkoutRoute),

  /**
   * Wrapped webhook route handler
   * @example
   * // POST /api/webhooks/stripe
   * // This is typically called by Stripe, not directly by your application
   * const response = await fetch('/api/webhooks/stripe', {
   *   method: 'POST',
   *   headers: { 'Stripe-Signature': 'webhook_secret' },
   *   body: JSON.stringify(eventData)
   * });
   */
  webhook: withCookies(webhookRoute),
  withCookies: withCookies,
};
