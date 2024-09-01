import { desc, eq, like, or, sql } from "drizzle-orm";
import { Context } from "hono";
import { DatabaseError, QueryError } from "../errors/index.js";
import { ErrorCode } from "../errors/error-code.js";
import { DatabaseClient, DrizzleDatabase } from "./db.js";
import * as schema from "./schema/index.js";
import { BusinessAccount } from "./schema/index.js";
import { z } from "zod";

/**
 * BusinessAccountDatabaseClient class for managing business account operations in the database.
 * This class follows the singleton pattern and extends DatabaseClient.
 */
export class BusinessAccountDatabaseClient extends DatabaseClient {
  private static instance: BusinessAccountDatabaseClient | null = null;

  private constructor(db: D1Database) {
    super(db);
  }

  public static async getInstance(
    db: D1Database,
  ): Promise<BusinessAccountDatabaseClient> {
    if (!BusinessAccountDatabaseClient.instance) {
      BusinessAccountDatabaseClient.instance =
        new BusinessAccountDatabaseClient(db);
    }
    return BusinessAccountDatabaseClient.instance;
  }

  // Input validation schemas
  private nameSchema = z.string().min(1).max(100);
  private emailSchema = z.string().email();
  private taxIdSchema = z.string().min(1).max(50);

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
   * Checks if a business account exists by name or tax ID.
   * @throws {DatabaseError} If the name or tax ID is invalid.
   */
  public async checkBusinessAccountExists(name: string): Promise<boolean> {
    this.validateInput(this.nameSchema, name);

    return this.executeQuery(async (db) => {
      const businessAccount = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.businessAccounts)
        .where(or(eq(schema.businessAccounts.companyName, name)))
        .get();
      return businessAccount?.count ?? 0 > 0;
    }) as Promise<boolean>;
  }

  /**
   * Creates a new business account.
   * @throws {DatabaseError} If the account creation fails or if a business with the same name or tax ID already exists.
   */
  public async createBusinessAccount(params: {
    name: string;
    email: string;
  }): Promise<BusinessAccount> {
    const validatedParams = {
      companyName: this.validateInput(this.nameSchema, params.name),
      email: this.validateInput(this.emailSchema, params.email),
    };

    return this.executeTransaction(async (tx) => {
      const existingBusiness = await tx
        .select()
        .from(schema.businessAccounts)
        .where(
          or(
            eq(
              schema.businessAccounts.companyName,
              validatedParams.companyName,
            ),
          ),
        )
        .get();

      if (existingBusiness) {
        throw new DatabaseError({
          code: ErrorCode.NOT_UNIQUE,
          message: "Business account already exists",
        });
      }

      const [newAccount] = await tx
        .insert(schema.businessAccounts)
        .values({
          ...validatedParams,
          username: validatedParams.companyName, // Add username field
        })
        .returning();

      if (!newAccount) {
        throw new DatabaseError({
          code: ErrorCode.INTERNAL_SERVER_ERROR,
          message: "Failed to create business account",
        });
      }

      return newAccount;
    });
  }

  /**
   * Retrieves a business account by its ID.
   * @param id The ID of the business account to retrieve.
   * @returns The business account if found, null otherwise.
   * @throws {DatabaseError} If the business ID is not provided or if there's an error during the database query.
   */
  async getBusinessAccountById(id: number): Promise<BusinessAccount | null> {
    if (!id) {
      throw new DatabaseError({
        code: ErrorCode.BAD_REQUEST,
        message: "Business ID is required",
      });
    }

    try {
      return await this.executeQuery(async (db) => {
        const [businessAccount] = await db
          .select()
          .from(schema.businessAccounts)
          .where(eq(schema.businessAccounts.id, id));
        return businessAccount || null;
      });
    } catch (error) {
      throw new DatabaseError({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: `Failed to get business account by ID: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  }

  /**
   * Updates a business account.
   * @param id The ID of the business account to update.
   * @param updateData The data to update.
   * @returns The updated business account.
   * @throws {DatabaseError} If the update fails.
   */
  async updateBusinessAccount(
    id: number,
    updateData: Partial<BusinessAccount>,
  ): Promise<BusinessAccount> {
    try {
      const [updatedBusiness] = await this.getClient()
        .update(schema.businessAccounts)
        .set(updateData)
        .where(eq(schema.businessAccounts.id, id))
        .returning();
      if (!updatedBusiness) {
        throw new DatabaseError({
          code: "NOT_FOUND",
          message: `Business account with ID ${id} not found`,
        });
      }
      return updatedBusiness;
    } catch (error) {
      throw new DatabaseError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to update business account: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  }

  /**
   * Soft deletes a business account by setting isActive to false.
   * @param id The ID of the business account to soft delete.
   * @returns True if the account was soft deleted, false otherwise.
   */
  public async softDeleteBusinessAccount({
    id,
  }: {
    id: number;
  }): Promise<boolean> {
    if (!id) {
      throw new DatabaseError({
        code: ErrorCode.BAD_REQUEST,
        message: "Business ID is required for deletion",
      });
    }

    try {
      return await this.executeQuery(async (db) => {
        const result = await db
          .update(schema.businessAccounts)
          .set({ isActive: false })
          .where(eq(schema.businessAccounts.id, id))
          .returning({ id: schema.businessAccounts.id });
        return !!result;
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Hard deletes a business account.
   * @param id The ID of the business account to delete.
   * @returns True if the account was deleted, false otherwise.
   */
  async hardDeleteBusinessAccount({ id }: { id: number }): Promise<boolean> {
    if (!id) {
      throw new DatabaseError({
        code: ErrorCode.BAD_REQUEST,
        message: "Business ID is required for deletion",
      });
    }

    try {
      return await this.executeQuery(async (db) => {
        const [result] = await db
          .delete(schema.businessAccounts)
          .where(eq(schema.businessAccounts.id, id))
          .returning({ id: schema.businessAccounts.id });
        return !!result;
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Searches for business accounts based on a query string.
   * @param query The search query.
   * @param limit The maximum number of results to return.
   * @param offset The number of results to skip.
   * @returns An array of business accounts matching the search criteria.
   */
  async searchBusinessAccounts(
    query: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<BusinessAccount[]> {
    const sanitizedQuery = query.replace(/[%_]/g, "\\$&"); // Escape special characters
    return this.executeQuery(async (db) => {
      return db
        .select()
        .from(schema.businessAccounts)
        .where(
          or(
            like(schema.businessAccounts.companyName, `%${sanitizedQuery}%`),
            like(schema.businessAccounts.email, `%${sanitizedQuery}%`),
          ),
        )
        .limit(limit)
        .offset(offset);
    });
  }

  /**
   * Retrieves recently created business accounts.
   * @param limit The maximum number of results to return.
   * @returns An array of recently created business accounts.
   */
  async getRecentlyCreatedBusinessAccounts(
    limit: number = 10,
  ): Promise<BusinessAccount[]> {
    return this.executeQuery(async (db) => {
      return db
        .select()
        .from(schema.businessAccounts)
        .orderBy(desc(schema.businessAccounts.createdAt))
        .limit(limit);
    });
  }

  /**
   * Retrieves a business account with all its related data including teams, address, API keys, and settings.
   *
   * @param businessId The ID of the business account to retrieve.
   * @returns A Promise resolving to an object containing the business account and all its related data.
   * @throws {DatabaseError} If the business is not found or if there's an error during the database query.
   */
  async getBusinessWithAllRelations(businessId: number): Promise<{
    business: BusinessAccount;
    teams: Array<{ id: number; name: string }>;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    } | null;
    apiKeys: Array<{ id: number; key: string; name: string }>;
    settings: { [key: string]: any } | null;
  }> {
    try {
      const result = await this.getClient().transaction(async (tx) => {
        // Fetch the business
        const [business] = await tx
          .select()
          .from(schema.businessAccounts)
          .where(eq(schema.businessAccounts.id, businessId));

        if (!business) {
          throw new DatabaseError({
            code: "NOT_FOUND",
            message: `Business with ID ${businessId} not found`,
          });
        }

        // Fetch teams
        const businessTeams = await tx
          .select({
            id: schema.teams.id,
            name: schema.teams.name,
          })
          .from(schema.teamMembers)
          .innerJoin(
            schema.teams,
            eq(schema.teamMembers.teamId, schema.teams.id),
          )
          .where(eq(schema.teamMembers.businessAccountId, businessId));

        // Fetch address
        const [businessAddress] = await tx
          .select({
            street: schema.addresses.address,
            city: schema.addresses.city,
            state: schema.addresses.state,
            zipcode: schema.addresses.zipcode,
            unit: schema.addresses.unit,
          })
          .from(schema.addresses)
          .where(eq(schema.addresses.businessAccountId, businessId));

        // Fetch API keys
        const businessApiKeys = await tx
          .select({
            id: schema.apiKeys.id,
            key: schema.apiKeys.key,
            name: schema.apiKeys.name,
          })
          .from(schema.apiKeys)
          .where(eq(schema.apiKeys.businessAccountId, businessId));

        // Fetch settings
        const [businessSettings] = await tx
          .select()
          .from(schema.settings)
          .where(eq(schema.settings.businessAccountId, businessId));

        return {
          business,
          teams: businessTeams,
          address: businessAddress || null,
          apiKeys: businessApiKeys,
          settings: businessSettings || null,
        };
      });

      return {
        business: result.business,
        teams: result.teams,
        address: result.address
          ? {
              street: result.address.street || "",
              city: result.address.city || "",
              state: result.address.state || "",
              country: "", // Add a default empty string for country
              postalCode: result.address.zipcode || "", // Use zipcode as postalCode
            }
          : null,
        apiKeys: result.apiKeys,
        settings: result.settings,
      };
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to retrieve business data: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  }
}
