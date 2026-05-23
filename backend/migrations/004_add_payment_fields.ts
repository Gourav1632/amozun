import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
    // Add payment_method and payment_status to orders table
    await db.schema
        .alterTable('orders')
        .addColumn('payment_method', 'varchar(50)', (col) => col.defaultTo('COD').notNull())
        .addColumn('payment_status', 'varchar(50)', (col) => col.defaultTo('PENDING').notNull())
        .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema
        .alterTable('orders')
        .dropColumn('payment_method')
        .dropColumn('payment_status')
        .execute()
}
