import type { Kysely } from "kysely";
import { sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable("recently_viewed")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
        .addColumn("user_id", "uuid", (col) => col.references("users.id").onDelete("cascade").notNull())
        .addColumn("product_id", "uuid", (col) => col.references("products.id").onDelete("cascade").notNull())
        .addColumn("viewed_at", "timestamp", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
        .addUniqueConstraint("recently_viewed_user_product_unique", ["user_id", "product_id"])
        .execute();

    await db.schema.createIndex("idx_recently_viewed_user").on("recently_viewed").column("user_id").execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("recently_viewed").ifExists().execute();
}
