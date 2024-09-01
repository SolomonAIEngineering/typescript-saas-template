import type { App } from "../../pkg/hono/app.js";
import { serviceDurableObjectRoute } from "./routes.js";
import { handleServiceDurableObjectRequest } from "./handlers.js";
import { RouteConfigToTypedResponse } from "@hono/zod-openapi";

export class ServiceDurableObjectEndpoint {
  private readonly app: App;

  constructor(app: App) {
    this.app = app;
  }
  public registerRoutes() {
    this.app.openapi(serviceDurableObjectRoute, async (c) => {
      const response = await handleServiceDurableObjectRequest(c);
      return response as unknown as RouteConfigToTypedResponse<
        typeof serviceDurableObjectRoute
      >;
    });
  }
}

export const registerV1ServiceDurableObjectRoutes = (app: App) => {
  const serviceDurableObjectEndpoint = new ServiceDurableObjectEndpoint(app);
  serviceDurableObjectEndpoint.registerRoutes();
};
