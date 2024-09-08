import { Bindings } from "../bindings/index.js";
import { DatabaseManager } from "../database/client.js";
import { ConsoleLogger } from "../logger/logger.js";
import { Metrics } from "../metrics/index.js";
import { TriggerClient } from "@trigger.dev/sdk";

export type ServiceContext = {
  logger: ConsoleLogger;
  db: DatabaseManager;
  metrics: Metrics;
  triggerClient: TriggerClient;
};

export type HonoEnv = {
  Bindings: Bindings;
  Variables: {
    isolateId: string;
    isolateCreatedAt: number;
    requestId: string;
    metricsContext: {
      keyId?: string;
      [key: string]: unknown;
    };
    services: ServiceContext;
    /**
     * IP address or region information
     */
    location: string;
    userAgent?: string;
  };
};
