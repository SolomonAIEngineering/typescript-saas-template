import { TriggerClient } from "@trigger.dev/sdk";
import { jobManager } from "./index";

export class TriggerClientWrapper {
  private client: TriggerClient;

  constructor(id: string, apiKey: string, apiUrl: string) {
    this.client = new TriggerClient({
      id,
      apiKey,
      apiUrl,
    });

    jobManager.attachJobsToClient(this.client);
  }

  getClient(): TriggerClient {
    return this.client;
  }
}
