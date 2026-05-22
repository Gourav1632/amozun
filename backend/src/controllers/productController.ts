import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { AppError } from "../utils/AppError.js";

export const getAllProducts = async (req: Request, res: Response) => {
    const { search, category, page = "1", limit = "12" } = req.query;

    let query = db
        .selectFrom('products')
        .innerJoin('categories', 'categories.id', 'products.category_id')
        .leftJoin('product_images', (join) =>
            join
                .onRef('product_images.product_id', '=', 'products.id')
                .on('product_images.is_primary', '=', true)
        )
        .select([
            'products.id',
            'products.name',
            'products.price',
            'products.mrp',
            'products.stock',
            'categories.name as category_name',
            'categories.slug as category_slug',
            'product_images.url as image_url',
        ]);

    if (search && typeof search === 'string') {
        query = query.where('products.name', 'ilike', `%${search}%`)
    }

    if (category && typeof category === 'string') {
        query = query.where('categories.slug', '=', category);
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    const products = await query
        .orderBy('products.created_at', 'desc')
        .limit(limitNum)
        .offset(offset)
        .execute();

    let countQuery = db
        .selectFrom('products')
        .innerJoin('categories', 'categories.id', 'products.category_id')
        .select(db.fn.countAll().as('total'));

    if (search && typeof search === 'string') {
        countQuery = countQuery.where('products.name', 'ilike', `%${search}%`);
    }

    if (category && typeof category === 'string') {
        countQuery = countQuery.where('categories.slug', '=', category);
    }

    const { total } = await countQuery
        .executeTakeFirstOrThrow();

    res.json({
        status: 'success',
        data: products,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total: Number(total),
            totalPages: Math.ceil(Number(total) / limitNum),
        }
    })

}


export const getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || typeof id != 'string') {
        throw new AppError('Product ID is required.', 400);
    }

    const product = await db
        .selectFrom("products")
        .innerJoin("categories", "categories.id", "products.category_id")
        .where("products.id", "=", id)
        .select([
            "products.id",
            "products.name",
            "products.description",
            "products.specifications",
            "products.price",
            "products.mrp",
            "products.stock",
            "products.category_id",
            "products.created_at",
            "categories.name as category_name",
            "categories.slug as category_slug",
        ])
        .executeTakeFirst();
    if (!product) {
        throw new AppError("Product not found.", 404);
    }
    const images = await db
        .selectFrom("product_images")
        .where("product_id", "=", id)
        .selectAll()
        .orderBy("display_order", "asc")
        .execute();
    res.json({
        status: "success",
        data: { ...product, images },
    });
};