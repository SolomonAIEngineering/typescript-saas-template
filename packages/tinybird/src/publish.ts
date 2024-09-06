import { getTinybird } from "./tinybird.ts";
import { emailEventSchema, EmailEvent } from "./types/index.ts";

const tb = getTinybird();

export const publishEmailEvent = tb?.buildIngestEndpoint({
  datasource: "email_events",
  event: emailEventSchema,
});

export type { EmailEvent };
