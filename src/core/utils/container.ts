import { Knex } from "knex";
import DatabaseConnection from "@/core/database/postgres/connection";
import { Logger } from "@/core/utils/logger";

interface Dependencies {
  db: Knex;
  logger: Logger;
}

class Container {
  private static instance: Container;
  private dependencies: Partial<Dependencies> = {};

  private constructor() {
    // Initialize logger early since it might be needed during other initializations
    this.dependencies.logger = Logger.getInstance();
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public async initialize(): Promise<void> {
    // Database connection
    const dbConnection = DatabaseConnection.getInstance();
    this.dependencies.db = await dbConnection.connect();
  }

  public get<K extends keyof Dependencies>(key: K): Dependencies[K] {
    const dependency = this.dependencies[key];
    if (!dependency) {
      throw new Error(`Dependency ${String(key)} not found`);
    }
    return dependency;
  }

  public set<K extends keyof Dependencies>(
    key: K,
    value: Dependencies[K]
  ): void {
    this.dependencies[key] = value;
  }
}

export default Container;
