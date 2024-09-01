import { Bindings } from "../bindings/index.js";
import { DatabaseClient } from "./db.js";
import { UserAccountDatabaseClient } from "./user-account-client.js";

export class DatabaseManager {
  private static instance: DatabaseManager | null = null;
  private userAccountDbClient: UserAccountDatabaseClient | null = null;

  private constructor() {}

  public static async getInstance(db: D1Database): Promise<DatabaseManager> {
    if (!DatabaseManager.instance) {
      const client = await UserAccountDatabaseClient.getInstance(db);
      DatabaseManager.instance = new DatabaseManager();
      DatabaseManager.instance.userAccountDbClient = client;
    }

    return DatabaseManager.instance;
  }
}
