import type { Kysely } from "kysely";
import { sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    // Enable UUID generation
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.execute(db);

    await db.schema
        .createTable("users")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("email", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("password_hash", "varchar(255)", (col) => col.notNull())
        .addColumn("created_at", "timestamptz", (col) => col.defaultTo(sql`now()`).notNull())
        .execute();

    await db.schema
        .createTable("categories")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("slug", "varchar(255)", (col) => col.notNull().unique())
        .addColumn("image_url", "text", (col) => col.notNull())
        .execute();

    await db.schema
        .createTable("products")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
        .addColumn("name", "varchar(255)", (col) => col.notNull())
        .addColumn("description", "text", (col) => col.notNull())
        .addColumn("specifications", "text")
        .addColumn("price", sql`decimal(10,2)`, (col) => col.notNull())
        .addColumn("mrp", sql`decimal(10,2)`, (col) => col.notNull())
        .addColumn("stock", "integer", (col) => col.defaultTo(0).notNull())
        .addColumn("category_id", "uuid", (col) => col.references("categories.id").notNull())
        .addColumn("created_at", "timestamptz", (col) => col.defaultTo(sql`now()`).notNull())
        .execute();

    await db.schema.createIndex("idx_products_category").on("products").column("category_id").execute();
    await db.schema.createIndex("idx_products_name").on("products").column("name").execute();

    await db.schema
        .createTable("product_images")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
        .addColumn("product_id", "uuid", (col) => col.references("products.id").onDelete("cascade").notNull())
        .addColumn("url", "text", (col) => col.notNull())
        .addColumn("display_order", "integer", (col) => col.defaultTo(0).notNull())
        .addColumn("is_primary", "boolean", (col) => col.defaultTo(false).notNull())
        .execute();

    await db.schema
        .createTable("carts")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
        .addColumn("user_id", "uuid", (col) => col.references("users.id").onDelete("cascade").notNull().unique())
        .addColumn("updated_at", "timestamptz", (col) => col.defaultTo(sql`now()`).notNull())
        .execute();

    await db.schema
        .createTable("cart_items")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
        .addColumn("cart_id", "uuid", (col) => col.references("carts.id").onDelete("cascade").notNull())
        .addColumn("product_id", "uuid", (col) => col.references("products.id").notNull())
        .addColumn("quantity", "integer", (col) => col.defaultTo(1).notNull())
        .addUniqueConstraint("uq_cart_items_cart_product", ["cart_id", "product_id"])
        .execute();

    await db.schema
        .createTable("wishlists")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
        .addColumn("user_id", "uuid", (col) => col.references("users.id").onDelete("cascade").notNull().unique())
        .execute();

    await db.schema
        .createTable("wishlist_items")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
        .addColumn("wishlist_id", "uuid", (col) => col.references("wishlists.id").onDelete("cascade").notNull())
        .addColumn("product_id", "uuid", (col) => col.references("products.id").notNull())
        .addColumn("added_at", "timestamptz", (col) => col.defaultTo(sql`now()`).notNull())
        .addUniqueConstraint("uq_wishlist_items_wishlist_product", ["wishlist_id", "product_id"])
        .execute();

    await db.schema
        .createTable("orders")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
        .addColumn("user_id", "uuid", (col) => col.references("users.id").notNull())
        .addColumn("status", "varchar(20)", (col) => col.defaultTo("PENDING").notNull())
        .addColumn("total_amount", sql`decimal(10,2)`, (col) => col.notNull())
        .addColumn("created_at", "timestamptz", (col) => col.defaultTo(sql`now()`).notNull())
        .execute();

    await db.schema.createIndex("idx_orders_user").on("orders").column("user_id").execute();

    await db.schema
        .createTable("order_items")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
        .addColumn("order_id", "uuid", (col) => col.references("orders.id").onDelete("cascade").notNull())
        .addColumn("product_id", "uuid", (col) => col.references("products.id").notNull())
        .addColumn("quantity", "integer", (col) => col.notNull())
        .addColumn("price_at_purchase", sql`decimal(10,2)`, (col) => col.notNull())
        .addColumn("product_name_snapshot", "varchar(255)", (col) => col.notNull())
        .execute();

    await db.schema
        .createTable("shipping_addresses")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`uuid_generate_v4()`))
        .addColumn("order_id", "uuid", (col) => col.references("orders.id").onDelete("cascade").notNull().unique())
        .addColumn("full_name", "varchar(255)", (col) => col.notNull())
        .addColumn("address_line1", "text", (col) => col.notNull())
        .addColumn("address_line2", "text")
        .addColumn("city", "varchar(255)", (col) => col.notNull())
        .addColumn("state", "varchar(255)", (col) => col.notNull())
        .addColumn("zip_code", "varchar(20)", (col) => col.notNull())
        .addColumn("phone", "varchar(20)", (col) => col.notNull())
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    // Drop in reverse order to respect foreign key constraints
    await db.schema.dropTable("shipping_addresses").ifExists().execute();
    await db.schema.dropTable("order_items").ifExists().execute();
    await db.schema.dropTable("orders").ifExists().execute();
    await db.schema.dropTable("wishlist_items").ifExists().execute();
    await db.schema.dropTable("wishlists").ifExists().execute();
    await db.schema.dropTable("cart_items").ifExists().execute();
    await db.schema.dropTable("carts").ifExists().execute();
    await db.schema.dropTable("product_images").ifExists().execute();
    await db.schema.dropTable("products").ifExists().execute();
    await db.schema.dropTable("categories").ifExists().execute();
    await db.schema.dropTable("users").ifExists().execute();
}
