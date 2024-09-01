import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { Context } from "hono";
import { DatabaseError, QueryError } from "../errors/index.js";
import { ErrorCode } from "../errors/error-code.js";
import { DatabaseClient, DrizzleDatabase } from "./db.js";
import * as schema from "./schema/index.js";
import { Team } from "./schema/index.js";
import { z } from "zod";

/**
 * TeamDatabaseClient class for managing team operations in the database.
 * This class follows the singleton pattern and extends DatabaseClient.
 */
export class TeamDatabaseClient extends DatabaseClient {
  private static instance: TeamDatabaseClient | null = null;

  private constructor(db: D1Database) {
    super(db);
  }

  public static async getInstance(db: D1Database): Promise<TeamDatabaseClient> {
    if (!TeamDatabaseClient.instance) {
      TeamDatabaseClient.instance = new TeamDatabaseClient(db);
    }
    return TeamDatabaseClient.instance;
  }

  // Input validation schemas
  private nameSchema = z.string().min(1).max(100);
  private descriptionSchema = z.string().max(500).optional();

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
   * Creates a new team.
   * @throws {DatabaseError} If the team creation fails or if a team with the same name already exists.
   */
  public async createTeam(params: {
    name: string;
    description?: string;
    teamAdminId: number;
  }): Promise<Team> {
    const validatedParams = {
      name: this.validateInput(this.nameSchema, params.name),
      description: params.description
        ? this.validateInput(this.descriptionSchema, params.description)
        : undefined,
      teamAdminId: params.teamAdminId,
    };

    return this.executeTransaction(async (tx) => {
      const existingTeam = await tx
        .select()
        .from(schema.teams)
        .where(eq(schema.teams.name, validatedParams.name))
        .get();

      if (existingTeam) {
        throw new DatabaseError({
          code: ErrorCode.NOT_UNIQUE,
          message: "Team with this name already exists",
        });
      }

      const [newTeam] = await tx
        .insert(schema.teams)
        .values(validatedParams)
        .returning();

      if (!newTeam) {
        throw new DatabaseError({
          code: ErrorCode.INTERNAL_SERVER_ERROR,
          message: "Failed to create team",
        });
      }

      return newTeam;
    });
  }

  /**
   * Retrieves a team by its ID.
   * @param id The ID of the team to retrieve.
   * @returns The team if found, null otherwise.
   * @throws {DatabaseError} If the team ID is not provided or if there's an error during the database query.
   */
  async getTeamById(id: number): Promise<Team | null> {
    if (!id) {
      throw new DatabaseError({
        code: ErrorCode.BAD_REQUEST,
        message: "Team ID is required",
      });
    }

    try {
      return await this.executeQuery(async (db) => {
        const [team] = await db
          .select()
          .from(schema.teams)
          .where(eq(schema.teams.id, id));
        return team || null;
      });
    } catch (error) {
      throw new DatabaseError({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: `Failed to get team by ID: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  }

  /**
   * Updates a team.
   * @param id The ID of the team to update.
   * @param updateData The data to update.
   * @returns The updated team.
   * @throws {DatabaseError} If the update fails.
   */
  async updateTeam(id: number, updateData: Partial<Team>): Promise<Team> {
    try {
      const [updatedTeam] = await this.getClient()
        .update(schema.teams)
        .set(updateData)
        .where(eq(schema.teams.id, id))
        .returning();
      if (!updatedTeam) {
        throw new DatabaseError({
          code: "NOT_FOUND",
          message: `Team with ID ${id} not found`,
        });
      }
      return updatedTeam;
    } catch (error) {
      throw new DatabaseError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to update team: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  }

  /**
   * Deletes a team.
   * @param id The ID of the team to delete.
   * @returns True if the team was deleted, false otherwise.
   */
  async deleteTeam(id: number): Promise<boolean> {
    if (!id) {
      throw new DatabaseError({
        code: ErrorCode.BAD_REQUEST,
        message: "Team ID is required for deletion",
      });
    }

    try {
      return await this.executeQuery(async (db) => {
        const [result] = await db
          .delete(schema.teams)
          .where(eq(schema.teams.id, id))
          .returning({ id: schema.teams.id });
        return !!result;
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Searches for teams based on a query string.
   * @param query The search query.
   * @param limit The maximum number of results to return.
   * @param offset The number of results to skip.
   * @returns An array of teams matching the search criteria.
   */
  async searchTeams(
    query: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<Team[]> {
    const sanitizedQuery = query.replace(/[%_]/g, "\\$&"); // Escape special characters
    return this.executeQuery(async (db) => {
      return db
        .select()
        .from(schema.teams)
        .where(
          or(
            like(schema.teams.name, `%${sanitizedQuery}%`),
            like(schema.teams.description, `%${sanitizedQuery}%`),
          ),
        )
        .limit(limit)
        .offset(offset);
    });
  }

  /**
   * Retrieves recently created teams.
   * @param limit The maximum number of results to return.
   * @returns An array of recently created teams.
   */
  async getRecentlyCreatedTeams(limit: number = 10): Promise<Team[]> {
    return this.executeQuery(async (db) => {
      return db
        .select()
        .from(schema.teams)
        .orderBy(desc(schema.teams.createdAt))
        .limit(limit);
    });
  }

  /**
   * Adds a member to a team.
   * @param teamId The ID of the team.
   * @param memberId The ID of the user or business account to add.
   * @param memberType 'user' or 'business'
   * @returns True if the member was added successfully, false otherwise.
   */
  async addTeamMember(
    teamId: number,
    memberId: number,
    memberType: "user" | "business",
  ): Promise<boolean> {
    return this.executeTransaction(async (tx) => {
      const [result] = await tx
        .insert(schema.teamMembers)
        .values({
          teamId,
          ...(memberType === "user"
            ? { userAccountId: memberId }
            : { businessAccountId: memberId }),
        })
        .returning({ id: schema.teamMembers.teamId });
      return !!result;
    });
  }

  /**
   * Removes a member from a team.
   * @param teamId The ID of the team.
   * @param memberId The ID of the user or business account to remove.
   * @param memberType 'user' or 'business'
   * @returns True if the member was removed successfully, false otherwise.
   */
  async removeTeamMember(
    teamId: number,
    memberId: number,
    memberType: "user" | "business",
  ): Promise<boolean> {
    return this.executeQuery(async (db) => {
      const [result] = await db
        .delete(schema.teamMembers)
        .where(
          and(
            eq(schema.teamMembers.teamId, teamId),
            memberType === "user"
              ? eq(schema.teamMembers.userAccountId, memberId)
              : eq(schema.teamMembers.businessAccountId, memberId),
          ),
        )
        .returning({ id: schema.teamMembers.teamId });
      return !!result;
    });
  }

  /**
   * Retrieves all members of a team.
   * @param teamId The ID of the team.
   * @returns An array of team members (both users and businesses).
   */
  async getTeamMembers(
    teamId: number,
  ): Promise<Array<{ id: number; name: string; type: "user" | "business" }>> {
    return this.executeQuery(async (db) => {
      const userMembers = await db
        .select({
          id: schema.userAccounts.id,
          name: sql<string>`COALESCE(${schema.userAccounts.username}, '')`.as(
            "name",
          ),
          type: sql<"user">`'user'`.as("type"),
        })
        .from(schema.teamMembers)
        .innerJoin(
          schema.userAccounts,
          eq(schema.teamMembers.userAccountId, schema.userAccounts.id),
        )
        .where(eq(schema.teamMembers.teamId, teamId));

      const businessMembers = await db
        .select({
          id: schema.businessAccounts.id,
          name: sql<string>`COALESCE(${schema.businessAccounts.companyName}, '')`.as(
            "name",
          ),
          type: sql<"business">`'business'`.as("type"),
        })
        .from(schema.teamMembers)
        .innerJoin(
          schema.businessAccounts,
          eq(schema.teamMembers.businessAccountId, schema.businessAccounts.id),
        )
        .where(eq(schema.teamMembers.teamId, teamId));

      return [...userMembers, ...businessMembers] as Array<{
        id: number;
        name: string;
        type: "user" | "business";
      }>;
    });
  }

  /**
   * Retrieves a team with all its related data including members and settings.
   *
   * @param teamId The ID of the team to retrieve.
   * @returns A Promise resolving to an object containing the team and all its related data.
   * @throws {DatabaseError} If the team is not found or if there's an error during the database query.
   */
  async getTeamWithAllRelations(teamId: number): Promise<{
    team: Team;
    members: Array<{ id: number; name: string; type: "user" | "business" }>;
  }> {
    try {
      const result = await this.getClient().transaction(async (tx) => {
        // Fetch the team
        const [team] = await tx
          .select()
          .from(schema.teams)
          .where(eq(schema.teams.id, teamId));

        if (!team) {
          throw new DatabaseError({
            code: "NOT_FOUND",
            message: `Team with ID ${teamId} not found`,
          });
        }

        // Fetch team members
        const members = await this.getTeamMembers(teamId);

        return {
          team,
          members,
        };
      });

      return result;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to retrieve team data: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  }
}
