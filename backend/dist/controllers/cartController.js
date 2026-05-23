import { db } from '../db/index.js';
import { join } from "node:path";
import { AppError } from "../utils/AppError.js";
export const getOrCreateCart = async (userId) => {
    let cart = await db
        .selectFrom('carts')
        .where('user_id', '=', userId)
        .selectAll()
        .executeTakeFirst();
    if (!cart) {
        cart = await db
            .insertInto('carts')
            .values({ user_id: userId })
            .returningAll()
            .executeTakeFirstOrThrow();
    }
    return cart;
};
export const getCart = async (req, res) => {
    const cart = await getOrCreateCart(req.userId);
    const items = await db
        .selectFrom('cart_items')
        .innerJoin('products', 'products.id', 'cart_items.product_id')
        .leftJoin('product_images', (join) => join
        .onRef('product_images.product_id', '=', 'products.id')
        .on('product_images.is_primary', '=', true))
        .where('cart_items.cart_id', '=', cart.id)
        .select([
        'cart_items.id as cart_item_id',
        'cart_items.quantity',
        'products.id as product_id',
        'products.name',
        'products.price',
        'products.mrp',
        'products.stock',
        'product_images.url as image_url',
    ])
        .orderBy('cart_items.id', 'asc')
        .execute();
    res.json({
        status: 'success',
        data: {
            id: cart.id,
            items
        }
    });
};
export const addToCart = async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
        throw new AppError('Product ID is required.', 400);
    }
    // verify if product exists and has enough stock
    const product = await db
        .selectFrom('products')
        .where('id', '=', productId)
        .select(['id', 'stock'])
        .executeTakeFirst();
    if (!product) {
        throw new AppError('Product not found.', 404);
    }
    if (product.stock < quantity) {
        throw new AppError('Not enough stock available.', 400);
    }
    const cart = await getOrCreateCart(req.userId);
    // check if item already in cart
    const existingItem = await db
        .selectFrom('cart_items')
        .where('cart_id', '=', cart.id)
        .where('product_id', '=', productId)
        .selectAll()
        .executeTakeFirst();
    if (existingItem) {
        const newQuantity = Number(existingItem.quantity) + Number(quantity);
        if (product.stock < newQuantity) {
            throw new AppError('Not enough stock available.', 400);
        }
        await db
            .updateTable('cart_items')
            .set({ quantity: newQuantity })
            .where('id', '=', existingItem.id)
            .execute();
    }
    else {
        await db
            .insertInto('cart_items')
            .values({
            cart_id: cart.id,
            product_id: productId,
            quantity,
        })
            .execute();
    }
    await db
        .updateTable('carts')
        .set({ updated_at: new Date().toISOString() })
        .where('id', '=', cart.id)
        .execute();
    res.status(201).json({
        status: 'success',
        message: 'Added to cart.'
    });
};
export const updateCartItem = async (req, res) => {
    const { itemId } = req.params;
    if (!itemId || typeof itemId !== "string") {
        throw new AppError("Item ID is required.", 400);
    }
    let { quantity } = req.body;
    quantity = Number(quantity);
    if (isNaN(quantity) || quantity < 1) {
        throw new AppError("Valid quantity is required.", 400);
    }
    const cart = await getOrCreateCart(req.userId);
    // Verify item belongs to user's cart
    const item = await db
        .selectFrom("cart_items")
        .where("id", "=", itemId)
        .where("cart_id", "=", cart.id)
        .selectAll()
        .executeTakeFirst();
    if (!item) {
        throw new AppError("Cart item not found.", 404);
    }
    // Verify stock
    const product = await db
        .selectFrom("products")
        .where("id", "=", item.product_id)
        .select(["stock"])
        .executeTakeFirstOrThrow();
    if (product.stock < quantity) {
        throw new AppError("Not enough stock available.", 400);
    }
    await db
        .updateTable("cart_items")
        .set({ quantity })
        .where("id", "=", itemId)
        .execute();
    await db
        .updateTable("carts")
        .set({ updated_at: new Date().toISOString() })
        .where("id", "=", cart.id)
        .execute();
    res.json({ status: "success", message: "Cart updated" });
};
export const removeFromCart = async (req, res) => {
    const { itemId } = req.params;
    if (!itemId || typeof itemId !== "string") {
        throw new AppError("Item ID is required.", 400);
    }
    const cart = await getOrCreateCart(req.userId);
    const result = await db
        .deleteFrom("cart_items")
        .where("id", "=", itemId)
        .where("cart_id", "=", cart.id)
        .executeTakeFirst();
    if (Number(result.numDeletedRows) === 0) {
        throw new AppError("Cart item not found.", 404);
    }
    await db
        .updateTable("carts")
        .set({ updated_at: new Date().toISOString() })
        .where("id", "=", cart.id)
        .execute();
    res.json({ status: "success", message: "Item removed from cart" });
};
//# sourceMappingURL=cartController.js.map