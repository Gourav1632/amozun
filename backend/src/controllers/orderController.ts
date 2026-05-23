import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { AppError } from "../utils/AppError.js";
import { sendOrderConfirmationEmail } from "../services/emailService.js";
import { redisClient } from "../db/redis.js";
import { logger } from "../utils/logger.js";
import { stripe } from "../utils/stripe.js";
import type Stripe from "stripe";

export const placeOrder = async (req: Request, res: Response) => {
    const { shippingAddress, buyNowItem, paymentMethod = 'COD' } = req.body;

    if (!shippingAddress) {
        throw new AppError("Shipping address is required.", 400);
    }

    const userId = req.userId!;

    let cartItems: any[] = [];
    let cartId: string | null = null;

    if (buyNowItem) {
        const { productId, quantity } = buyNowItem;
        if (!productId || !quantity) throw new AppError("Invalid buy now item.", 400);

        const product = await db
            .selectFrom("products")
            .where("id", "=", productId)
            .select(["id as product_id", "name", "price", "stock"])
            .executeTakeFirst();

        if (!product) throw new AppError("Product not found.", 404);

        cartItems = [{
            product_id: product.product_id,
            quantity: Number(quantity),
            name: product.name,
            price: product.price,
            stock: product.stock
        }];
    } else {
        // 1. Get user's cart
        const cart = await db
            .selectFrom("carts")
            .where("user_id", "=", userId)
            .select("id")
            .executeTakeFirst();

        if (!cart) {
            throw new AppError("Cart not found.", 404);
        }
        cartId = cart.id;

        // 2. Get cart items with product details
        cartItems = await db
            .selectFrom("cart_items")
            .innerJoin("products", "products.id", "cart_items.product_id")
            .where("cart_items.cart_id", "=", cartId)
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
                status: paymentMethod === 'CARD' ? "PENDING" : "CONFIRMED",
                payment_method: paymentMethod === "CARD" ? "CARD" : "COD",
                payment_status: "PENDING",
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

        // d. Clear the cart (only if not Buy Now)
        if (cartId && !buyNowItem) {
            await trx
                .deleteFrom("cart_items")
                .where("cart_id", "=", cartId)
                .execute();
        }

        return newOrder.id;
    });

    // Invalidate product cache for purchased items
    try {
        const keysToDelete = cartItems.map(item => `product:${item.product_id}`);
        if (keysToDelete.length > 0) {
            await redisClient.del(keysToDelete);
        }
    } catch (err) {
        logger.error('Failed to invalidate product cache after order:', err);
    }

    if (paymentMethod === 'CARD') {
        const lineItems = cartItems.map((item) => ({
            price_data: {
                currency: 'inr',
                product_data: { name: item.name },
                unit_amount: Math.round(Number(item.price) * 100), // convert to paise
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            metadata: { orderId: orderId },
            success_url: `${process.env.FRONTEND_URL}/orders?success=true`,
            cancel_url: `${process.env.FRONTEND_URL}/checkout?cancelled=true`,
        });

        res.status(201).json({
            status: "success",
            message: "Order initiated",
            data: { orderId, url: session.url },
        });
    } else {
        const user = await db
            .selectFrom("users")
            .where("id", "=", userId)
            .select(["email", "name"])
            .executeTakeFirst();

        if (user) {
            const productIds = cartItems.map(item => item.product_id);
            let images: Record<string, string> = {};
            if (productIds.length > 0) {
                const imgs = await db.selectFrom("product_images")
                    .where("product_id", "in", productIds)
                    .where("is_primary", "=", true)
                    .select(["product_id", "url"])
                    .execute();
                imgs.forEach(img => images[img.product_id] = img.url);
            }

            const emailItems = cartItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image_url: images[item.product_id] || null
            }));

            await sendOrderConfirmationEmail(
                user.email,
                user.name,
                orderId,
                totalAmount,
                emailItems
            );
        }

        res.status(201).json({
            status: "success",
            message: "Order placed successfully",
            data: { orderId },
        });
    }

};

export const getMyOrders = async (req: Request, res: Response) => {
    const orders = await db
        .selectFrom("orders")
        .where("user_id", "=", req.userId!)
        .selectAll()
        .orderBy("created_at", "desc")
        .execute();

    // Fetch items for these orders
    const orderIds = orders.map(o => o.id);
    let itemsByOrderId: Record<string, any[]> = {};

    if (orderIds.length > 0) {
        const orderItems = await db
            .selectFrom("order_items")
            .leftJoin("product_images", (join) =>
                join
                    .onRef("product_images.product_id", "=", "order_items.product_id")
                    .on("product_images.is_primary", "=", true)
            )
            .where("order_items.order_id", "in", orderIds)
            .select([
                "order_items.order_id",
                "order_items.product_id",
                "order_items.product_name_snapshot",
                "product_images.url as image_url"
            ])
            .execute();

        orderItems.forEach(item => {
            const id = item.order_id;
            if (id) {
                if (!itemsByOrderId[id]) itemsByOrderId[id] = [];
                itemsByOrderId[id]!.push(item);
            }
        });
    }

    const ordersWithItems = orders.map(order => ({
        ...order,
        items: itemsByOrderId[order.id] || []
    }));

    res.json({ status: "success", data: ordersWithItems });
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

export const handleStripeWebhook = async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'];

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
        logger.error("Missing stripe signature or webhook secret");
        res.status(400).send(`Webhook Error: Missing signature or secret`);
        return;
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (err: any) {
        logger.error(`Webhook signature verification failed: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
            try {
                await db
                    .updateTable("orders")
                    .set({
                        payment_status: "PAID",
                        status: "CONFIRMED",
                    })
                    .where("id", "=", orderId)
                    .execute();

                const orderData = await db
                    .selectFrom("orders")
                    .innerJoin("users", "users.id", "orders.user_id")
                    .where("orders.id", "=", orderId)
                    .select(["users.email", "users.name", "orders.total_amount"])
                    .executeTakeFirst();

                if (orderData) {
                    const items = await db
                        .selectFrom("order_items")
                        .leftJoin("product_images", join => 
                            join.onRef("product_images.product_id", "=", "order_items.product_id")
                                .on("product_images.is_primary", "=", true)
                        )
                        .where("order_items.order_id", "=", orderId)
                        .select([
                            "order_items.product_name_snapshot as name",
                            "order_items.price_at_purchase as price",
                            "order_items.quantity",
                            "product_images.url as image_url"
                        ])
                        .execute();

                    await sendOrderConfirmationEmail(
                        orderData.email,
                        orderData.name,
                        orderId,
                        orderData.total_amount,
                        items
                    );
                }
                logger.info(`Successfully processed payment for order: ${orderId}`);
            } catch (err) {
                logger.error(`Error updating order after payment: ${err}`);
            }
        }
    } else if (
        event.type === 'checkout.session.expired' || 
        event.type === 'checkout.session.async_payment_failed'
    ) {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (orderId) {
            try {
                await db
                    .updateTable("orders")
                    .set({
                        payment_status: "FAILED",
                        status: "CANCELLED",
                    })
                    .where("id", "=", orderId)
                    .execute();
                    
                logger.warn(`Payment failed or expired for order: ${orderId}. Marked as CANCELLED.`);
            } catch (err) {
                logger.error(`Error updating failed order: ${err}`);
            }
        }
    }
    
    res.json({ received: true });
}