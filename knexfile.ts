import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      database: "honokick_dev",
      user: "postgres",
      password: "password",
      host: "localhost",
      port: 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/core/database/postgres/migration",
    },
  },

  production: {
    client: "pg",
    connection: {
      database: "honokick_prod",
      user: "postgres",
      password: "password",
      host: "localhost",
      port: 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/core/database/postgres/migration",
    },
  },
};

module.exports = config;
