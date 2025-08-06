// Update with your config settings.

const config = {
  development: {
    client: "pg",
    connection: {
      database: "honokick_dev",
      user: "root",
      password: "mypassword",
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
