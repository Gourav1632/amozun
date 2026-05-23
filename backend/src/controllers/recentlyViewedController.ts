import type { Request, Response } from "express";
import { sql } from "kysely";
import { db } from "../db/index.js";
import { AppError } from "../utils/AppError.js";

export const trackProductView = async (userId: string, productId: string) => {
    try {
        await db.insertInto('recently_viewed')
            .values({
                user_id: userId,
                product_id: productId,
            })
            .onConflict((oc) => oc
                .columns(['user_id', 'product_id'])
                .doUpdateSet({
                    viewed_at: sql`CURRENT_TIMESTAMP`
                })
            )
            .execute();
    } catch (e) {
        console.error('Failed to log recently viewed product:', e);
    }
};

export const addRecentlyViewed = async (req: Request, res: Response) => {
    const { productId } = req.body;
    const userId = req.userId;

    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }

    if (!productId) {
        throw new AppError("Product ID is required", 400);
    }

    try {
        await trackProductView(userId, productId);
        res.json({ status: "success", message: "Recently viewed updated" });
    } catch (e) {
        console.error('Failed to log recently viewed product:', e);
        throw new AppError("Failed to update recently viewed", 500);
    }
};

export const getRecentlyViewed = async (req: Request, res: Response) => {
    const userId = req.userId;

    if (!userId) {
        throw new AppError("Unauthorized", 401);
    }

    try {
        const recentlyViewed = await db
            .selectFrom('recently_viewed')
            .innerJoin('products', 'products.id', 'recently_viewed.product_id')
            .leftJoin('product_images', (join) =>
                join.onRef('product_images.product_id', '=', 'products.id')
                    .on('product_images.is_primary', '=', true)
            )
            .where('recently_viewed.user_id', '=', userId)
            .selectAll('products')
            .select([
                'recently_viewed.viewed_at',
                'product_images.url as image_url'
            ])
            .orderBy('recently_viewed.viewed_at', 'desc')
            .limit(10)
            .execute();

        res.json({ status: "success", data: recentlyViewed });
    } catch (e) {
        console.error('Failed to fetch recently viewed products:', e);
        throw new AppError("Failed to fetch recently viewed", 500);
    }
};
