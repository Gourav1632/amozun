import type { Kysely } from "kysely";
import { sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable("user_addresses")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
        .addColumn("user_id", "uuid", (col) => col.references("users.id").onDelete("cascade").notNull())
        .addColumn("full_name", "varchar(255)", (col) => col.notNull())
        .addColumn("address_line1", "text", (col) => col.notNull())
        .addColumn("address_line2", "text")
        .addColumn("city", "varchar(255)", (col) => col.notNull())
        .addColumn("state", "varchar(255)", (col) => col.notNull())
        .addColumn("zip_code", "varchar(20)", (col) => col.notNull())
        .addColumn("phone", "varchar(20)", (col) => col.notNull())
        .addColumn("is_default", "boolean", (col) => col.defaultTo(false).notNull())
        .execute();

    await db.schema.createIndex("idx_user_addresses_user").on("user_addresses").column("user_id").execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("user_addresses").ifExists().execute();
}
