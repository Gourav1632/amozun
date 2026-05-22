import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { AppError } from "../utils/AppError.js";
import { sendOrderConfirmationEmail } from "../services/emailService.js";

export const placeOrder = async (req: Request, res: Response) => {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
        throw new AppError("Shipping address is required.", 400);
    }

    const userId = req.userId!;

    // 1. Get user's cart
    const cart = await db
        .selectFrom("carts")
        .where("user_id", "=", userId)
        .select("id")
        .executeTakeFirst();

    if (!cart) {
        throw new AppError("Cart not found.", 404);
    }

    // 2. Get cart items with product details
    const cartItems = await db
        .selectFrom("cart_items")
        .innerJoin("products", "products.id", "cart_items.product_id")
        .where("cart_items.cart_id", "=", cart.id)
        .select([
            "cart_items.product_id",
            "cart_items.quantity",
            "products.name",
            "products.price",
            "products.stock",
        ])
        .execute();

    if (cartItems.length === 0) {
        throw new AppError("Cart is empty.", 400);
    }

    // 3. Verify stock for all items
    for (const item of cartItems) {
        if (item.stock < item.quantity) {
            throw new AppError(`Not enough stock for ${item.name}.`, 400);
        }
    }

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    );

    // 4. Execute transaction
    const orderId = await db.transaction().execute(async (trx) => {
        // a. Create order
        const newOrder = await trx
            .insertInto("orders")
            .values({
                user_id: userId,
                total_amount: totalAmount,
                status: "CONFIRMED",
            })
            .returning("id")
            .executeTakeFirstOrThrow();

        // b. Create order items & deduct stock
        for (const item of cartItems) {
            await trx
                .insertInto("order_items")
                .values({
                    order_id: newOrder.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price_at_purchase: item.price,
                    product_name_snapshot: item.name,
                })
                .execute();

            await trx
                .updateTable("products")
                .set((eb) => ({
                    stock: eb("stock", "-", item.quantity),
                }))
                .where("id", "=", item.product_id)
                .execute();
        }

        // c. Save shipping address
        await trx
            .insertInto("shipping_addresses")
            .values({
                order_id: newOrder.id,
                ...shippingAddress,
            })
            .execute();

        // d. Clear the cart
        await trx
            .deleteFrom("cart_items")
            .where("cart_id", "=", cart.id)
            .execute();

        return newOrder.id;
    });

    // 5. Send Email Notification
    const user = await db
        .selectFrom("users")
        .where("id", "=", userId)
        .select(["email", "name"])
        .executeTakeFirst();

    if (user) {
        await sendOrderConfirmationEmail(
            user.email,
            user.name,
            orderId,
            totalAmount
        );
    }

    res.status(201).json({
        status: "success",
        message: "Order placed successfully",
        data: { orderId },
    });
};

export const getMyOrders = async (req: Request, res: Response) => {
    const orders = await db
        .selectFrom("orders")
        .where("user_id", "=", req.userId!)
        .selectAll()
        .orderBy("created_at", "desc")
        .execute();

    res.json({ status: "success", data: orders });
};

export const getOrderById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
        throw new AppError("Order ID is required.", 400);
    }

    const order = await db
        .selectFrom("orders")
        .where("id", "=", id)
        .where("user_id", "=", req.userId!) // Security: ensure it belongs to them
        .selectAll()
        .executeTakeFirst();

    if (!order) {
        throw new AppError("Order not found.", 404);
    }

    const items = await db
        .selectFrom("order_items")
        .leftJoin("product_images", (join) =>
            join
                .onRef("product_images.product_id", "=", "order_items.product_id")
                .on("product_images.is_primary", "=", true)
        )
        .where("order_items.order_id", "=", order.id)
        .select([
            "order_items.id",
            "order_items.product_id",
            "order_items.quantity",
            "order_items.price_at_purchase",
            "order_items.product_name_snapshot",
            "product_images.url as image_url",
        ])
        .execute();

    const address = await db
        .selectFrom("shipping_addresses")
        .where("order_id", "=", order.id)
        .selectAll()
        .executeTakeFirst();

    res.json({
        status: "success",
        data: {
            ...order,
            items,
            shippingAddress: address,
        },
    });
};
