import { PostgresDialect } from "kysely";
import { defineConfig } from "kysely-ctl";
import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

export default defineConfig({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.DATABASE_URL,
        }),
    }),
    migrations: {
        migrationFolder: "migrations",
    },
});
