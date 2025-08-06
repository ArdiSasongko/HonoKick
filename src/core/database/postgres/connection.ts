import env from "@/core/utils/config";
import logger from "@/core/utils/logger";
import knex, { Knex } from "knex";

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private _connection: Knex | null = null;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<Knex> {
    if (!this._connection) {
      try {
        this._connection = knex({
          client: "pg",
          connection: {
            host: env.DB_HOST,
            port: env.DB_PORT,
            user: env.DB_USER,
            database: env.DB_NAME,
            password: env.DB_PASSWORD,
          },
          pool: {
            min: 0,
            max: 7,
            acquireTimeoutMillis: env.DB_TIMEOUT,
          },
        });

        await this._connection.raw("select 1");
        logger.info("Database Connected Success");
      } catch (error) {
        logger.error("Database Connected Failed:", error);
        throw error;
      }
    }

    return this._connection;
  }

  public getConnection(): Knex {
    if (!this._connection) {
      throw new Error("Database not connected");
    }

    return this._connection;
  }

  public async disconnect(): Promise<void> {
    if (this._connection) {
      await this._connection.destroy();
      this._connection = null;
      logger.info("Database disconnected");
    }
  }
}

export default DatabaseConnection;
