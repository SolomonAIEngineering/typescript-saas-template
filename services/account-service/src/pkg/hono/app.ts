import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { Context as GenericContext } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { handleError, handleZodError } from "../errors/index.js";
import type { HonoEnv } from "./env.js";

// Configuration for OpenAPI
const openApiConfig = {
  openapi: "3.0.0",
  info: {
    title: "Template Service API",
    version: "1.0.0",
    description: "Template Service API for deploying service to Cloudflare",
  },
  "x-speakeasy-retries": {
    strategy: "backoff",
    backoff: {
      initialInterval: 50,
      maxInterval: 1_000,
      maxElapsedTime: 30_000,
      exponent: 1.5,
    },
    statusCodes: ["5XX", "4XX", "401", "403", "404", "409", "429"],
    retryConnectionErrors: true,
  },
};

// New: Define middleware types
type Middleware = (c: Context, next: () => Promise<void>) => Promise<void>;

// New: Create a middleware factory
const createMiddleware = (fn: Middleware): Middleware => fn;

// New: Extract middlewares to separate functions
const addUserAgentMiddleware = createMiddleware(async (c, next) => {
  c.set("userAgent", c.req.header("User-Agent") || "Unknown");
  await next();
});

const securityScheme = {
  bearerAuth: {
    bearerFormat: "root key",
    type: "http" as const,
    scheme: "bearer",
  },
};

// New: Create a function to set up routes
const setupRoutes = (app: OpenAPIHono<HonoEnv>) => {
  app.doc("/openapi", openApiConfig);
  app.doc("/openapi.json", openApiConfig);
  app.get("/", swaggerUI({ url: "/openapi" }));
};

// New: Create a function to register components
const registerComponents = (app: OpenAPIHono<HonoEnv>) => {
  app.openAPIRegistry.registerComponent(
    "securitySchemes",
    "bearerAuth",
    securityScheme.bearerAuth,
  );
};

/**
 * Creates and configures a new Hono app with OpenAPI integration
 * @returns {OpenAPIHono<HonoEnv>} Configured Hono app
 */
export function createApp(): OpenAPIHono<HonoEnv> {
  const app = new OpenAPIHono<HonoEnv>({ defaultHook: handleZodError });

  // Middleware setup
  app.use(prettyJSON());
  app.onError(handleError);
  app.use("*", addUserAgentMiddleware);

  // Setup routes and register components
  setupRoutes(app);
  registerComponents(app);

  return app;
}

export type App = ReturnType<typeof createApp>;
export type Context = GenericContext<HonoEnv>;
