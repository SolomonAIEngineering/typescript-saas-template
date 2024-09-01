import { and, desc, eq, like } from "drizzle-orm";
import { DatabaseError } from "../errors/index.js";
import { ErrorCode } from "../errors/error-code.js";
import { DatabaseClient } from "./db.js";
import * as schema from "./schema/index.js";
import { ApiKey } from "./schema/index.js";
import { z } from "zod";

/**
 * ApiKeyDatabaseClient class for managing API key operations in the database.
 * This class follows the singleton pattern and extends DatabaseClient.
 */
export class ApiKeyDatabaseClient extends DatabaseClient {
  private static instance: ApiKeyDatabaseClient | null = null;

  private constructor(db: D1Database) {
    super(db);
  }

  public static async getInstance(
    db: D1Database,
  ): Promise<ApiKeyDatabaseClient> {
    if (!ApiKeyDatabaseClient.instance) {
      ApiKeyDatabaseClient.instance = new ApiKeyDatabaseClient(db);
    }
    return ApiKeyDatabaseClient.instance;
  }

  // Input validation schemas
  private nameSchema = z.string().min(1).max(100);
  private keySchema = z.string().min(16).max(64);

  /**
   * Validates input data using Zod schemas.
   * @throws {DatabaseError} If validation fails.
   */
  private validateInput<T>(schema: z.ZodType<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new DatabaseError({
          code: ErrorCode.BAD_REQUEST,
          message: `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
        });
      }
      throw error;
    }
  }

  /**
   * Creates a new API key.
   * @throws {DatabaseError} If the API key creation fails or if a key with the same name already exists for the user/business.
   */
  public async createApiKey(params: {
    name: string;
    key: string;
    userAccountId?: number;
    businessAccountId?: number;
  }): Promise<ApiKey> {
    const validatedParams = {
      name: this.validateInput(this.nameSchema, params.name),
      key: this.validateInput(this.keySchema, params.key),
      userAccountId: params.userAccountId,
      businessAccountId: params.businessAccountId,
    };

    return this.executeTransaction(async (tx) => {
      const existingKey = await tx
        .select()
        .from(schema.apiKeys)
        .where(
          and(
            eq(schema.apiKeys.name, validatedParams.name),
            params.userAccountId
              ? eq(schema.apiKeys.userAccountId, params.userAccountId)
              : eq(
                  schema.apiKeys.businessAccountId,
                  params.businessAccountId as number,
                ),
          ),
        )
        .get();

      if (existingKey) {
        throw new DatabaseError({
          code: ErrorCode.NOT_UNIQUE,
          message: "API key with this name already exists for this account",
        });
      }

      const [newApiKey] = await tx
        .insert(schema.apiKeys)
        .values(validatedParams)
        .returning();

      if (!newApiKey) {
        throw new DatabaseError({
          code: ErrorCode.INTERNAL_SERVER_ERROR,
          message: "Failed to create API key",
        });
      }

      return newApiKey;
    });
  }

  /**
   * Retrieves an API key by its ID.
   * @param id The ID of the API key to retrieve.
   * @returns The API key if found, null otherwise.
   * @throws {DatabaseError} If the API key ID is not provided or if there's an error during the database query.
   */
  async getApiKeyById(id: number): Promise<ApiKey | null> {
    if (!id) {
      throw new DatabaseError({
        code: ErrorCode.BAD_REQUEST,
        message: "API key ID is required",
      });
    }

    try {
      return await this.executeQuery(async (db) => {
        const [apiKey] = await db
          .select()
          .from(schema.apiKeys)
          .where(eq(schema.apiKeys.id, id));
        return apiKey || null;
      });
    } catch (error) {
      throw new DatabaseError({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: `Failed to get API key by ID: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  }

  /**
   * Updates an API key.
   * @param id The ID of the API key to update.
   * @param updateData The data to update.
   * @returns The updated API key.
   * @throws {DatabaseError} If the update fails.
   */
  async updateApiKey(id: number, updateData: Partial<ApiKey>): Promise<ApiKey> {
    try {
      const [updatedApiKey] = await this.getClient()
        .update(schema.apiKeys)
        .set(updateData)
        .where(eq(schema.apiKeys.id, id))
        .returning();
      if (!updatedApiKey) {
        throw new DatabaseError({
          code: "NOT_FOUND",
          message: `API key with ID ${id} not found`,
        });
      }
      return updatedApiKey;
    } catch (error) {
      throw new DatabaseError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to update API key: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  }

  /**
   * Deletes an API key.
   * @param id The ID of the API key to delete.
   * @returns True if the API key was deleted, false otherwise.
   */
  async deleteApiKey(id: number): Promise<boolean> {
    if (!id) {
      throw new DatabaseError({
        code: ErrorCode.BAD_REQUEST,
        message: "API key ID is required for deletion",
      });
    }

    try {
      return await this.executeQuery(async (db) => {
        const [result] = await db
          .delete(schema.apiKeys)
          .where(eq(schema.apiKeys.id, id))
          .returning({ id: schema.apiKeys.id });
        return !!result;
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Searches for API keys based on a query string.
   * @param query The search query.
   * @param limit The maximum number of results to return.
   * @param offset The number of results to skip.
   * @returns An array of API keys matching the search criteria.
   */
  async searchApiKeys(
    query: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<ApiKey[]> {
    const sanitizedQuery = query.replace(/[%_]/g, "\\$&"); // Escape special characters
    return this.executeQuery(async (db) => {
      return db
        .select()
        .from(schema.apiKeys)
        .where(like(schema.apiKeys.name, `%${sanitizedQuery}%`))
        .limit(limit)
        .offset(offset);
    });
  }

  /**
   * Retrieves recently created API keys.
   * @param limit The maximum number of results to return.
   * @returns An array of recently created API keys.
   */
  async getRecentlyCreatedApiKeys(limit: number = 10): Promise<ApiKey[]> {
    return this.executeQuery(async (db) => {
      return db
        .select()
        .from(schema.apiKeys)
        .orderBy(desc(schema.apiKeys.createdAt))
        .limit(limit);
    });
  }

  /**
   * Retrieves all API keys for a user or business account.
   * @param accountId The ID of the user or business account.
   * @param accountType 'user' or 'business'
   * @returns An array of API keys associated with the account.
   */
  async getApiKeysForAccount(
    accountId: number,
    accountType: "user" | "business",
  ): Promise<ApiKey[]> {
    return this.executeQuery(async (db) => {
      return db
        .select()
        .from(schema.apiKeys)
        .where(
          accountType === "user"
            ? eq(schema.apiKeys.userAccountId, accountId)
            : eq(schema.apiKeys.businessAccountId, accountId),
        );
    });
  }

  /**
   * Verifies an API key.
   * @param key The API key to verify.
   * @returns The API key details if valid, null otherwise.
   */
  async verifyApiKey(key: string): Promise<ApiKey | null> {
    return this.executeQuery(async (db) => {
      const [apiKey] = await db
        .select()
        .from(schema.apiKeys)
        .where(eq(schema.apiKeys.key, key));
      return apiKey || null;
    });
  }

  /**
   * Retrieves an API key with all its related data including usage statistics.
   *
   * @param apiKeyId The ID of the API key to retrieve.
   * @returns A Promise resolving to an object containing the API key and all its related data.
   * @throws {DatabaseError} If the API key is not found or if there's an error during the database query.
   */
  async getApiKeyWithAllRelations(apiKeyId: number): Promise<{
    apiKey: ApiKey;
  }> {
    try {
      const result = await this.getClient().transaction(async (tx) => {
        // Fetch the API key
        const [apiKey] = await tx
          .select()
          .from(schema.apiKeys)
          .where(eq(schema.apiKeys.id, apiKeyId));

        if (!apiKey) {
          throw new DatabaseError({
            code: "NOT_FOUND",
            message: `API key with ID ${apiKeyId} not found`,
          });
        }

        return {
          apiKey,
        };
      });

      return result;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to retrieve API key data: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  }
}
