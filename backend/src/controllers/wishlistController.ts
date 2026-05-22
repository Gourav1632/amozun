import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { AppError } from "../utils/AppError.js";

// Helper to get or create a wishlist
const getOrCreateWishlist = async (userId: string) => {
    let wishlist = await db
        .selectFrom("wishlists")
        .where("user_id", "=", userId)
        .selectAll()
        .executeTakeFirst();

    if (!wishlist) {
        wishlist = await db
            .insertInto("wishlists")
            .values({ user_id: userId })
            .returningAll()
            .executeTakeFirstOrThrow();
    }
    return wishlist;
};

export const getWishlist = async (req: Request, res: Response) => {
    const wishlist = await getOrCreateWishlist(req.userId!);

    const items = await db
        .selectFrom("wishlist_items")
        .innerJoin("products", "products.id", "wishlist_items.product_id")
        .leftJoin("product_images", (join) =>
            join
                .onRef("product_images.product_id", "=", "products.id")
                .on("product_images.is_primary", "=", true)
        )
        .where("wishlist_items.wishlist_id", "=", wishlist.id)
        .select([
            "wishlist_items.id as wishlist_item_id",
            "wishlist_items.added_at",
            "products.id as product_id",
            "products.name",
            "products.price",
            "products.stock",
            "product_images.url as image_url",
        ])
        .orderBy("wishlist_items.added_at", "desc")
        .execute();

    res.json({
        status: "success",
        data: {
            id: wishlist.id,
            items,
        },
    });
};

export const addToWishlist = async (req: Request, res: Response) => {
    const { productId } = req.body;

    if (!productId) {
        throw new AppError("Product ID is required.", 400);
    }

    const product = await db
        .selectFrom("products")
        .where("id", "=", productId)
        .select("id")
        .executeTakeFirst();

    if (!product) {
        throw new AppError("Product not found.", 404);
    }

    const wishlist = await getOrCreateWishlist(req.userId!);

    // Check if already in wishlist
    const existingItem = await db
        .selectFrom("wishlist_items")
        .where("wishlist_id", "=", wishlist.id)
        .where("product_id", "=", productId)
        .select("id")
        .executeTakeFirst();

    if (existingItem) {
        res.json({ status: "success", message: "Already in wishlist" });
        return;
    }

    await db
        .insertInto("wishlist_items")
        .values({
            wishlist_id: wishlist.id,
            product_id: productId,
        })
        .execute();

    res.status(201).json({ status: "success", message: "Added to wishlist" });
};

export const removeFromWishlist = async (req: Request, res: Response) => {
    const { itemId } = req.params;

    if (!itemId || typeof itemId !== "string") {
        throw new AppError("Item ID is required.", 400);
    }

    const wishlist = await getOrCreateWishlist(req.userId!);

    const result = await db
        .deleteFrom("wishlist_items")
        .where("id", "=", itemId)
        .where("wishlist_id", "=", wishlist.id)
        .executeTakeFirst();

    if (Number(result.numDeletedRows) === 0) {
        throw new AppError("Wishlist item not found.", 404);
    }

    res.json({ status: "success", message: "Removed from wishlist" });
};
