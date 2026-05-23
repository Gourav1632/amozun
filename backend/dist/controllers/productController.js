import { sql } from "kysely";
import { db } from "../db/index.js";
import { AppError } from "../utils/AppError.js";
export const getAllProducts = async (req, res) => {
    let { search, category, page = "1", limit = "12", minPrice, maxPrice, minDiscount, sortBy, sortOrder } = req.query;
    let finalSearchQuery = typeof search === 'string' ? search : undefined;
    let parsedMinPrice = minPrice ? parseFloat(minPrice) : undefined;
    let parsedMaxPrice = maxPrice ? parseFloat(maxPrice) : undefined;
    if (finalSearchQuery) {
        const maxMatch = finalSearchQuery.match(/(?:under|below|less than)\s*(\d+)/i);
        if (maxMatch && maxMatch[1]) {
            parsedMaxPrice = parseFloat(maxMatch[1]);
            finalSearchQuery = finalSearchQuery.replace(maxMatch[0], '').trim();
        }
        const minMatch = finalSearchQuery.match(/(?:over|above|more than)\s*(\d+)/i);
        if (minMatch && minMatch[1]) {
            parsedMinPrice = parseFloat(minMatch[1]);
            finalSearchQuery = finalSearchQuery.replace(minMatch[0], '').trim();
        }
    }
    let query = db
        .selectFrom('products')
        .innerJoin('categories', 'categories.id', 'products.category_id')
        .leftJoin('product_images', (join) => join
        .onRef('product_images.product_id', '=', 'products.id')
        .on('product_images.is_primary', '=', true))
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
    if (finalSearchQuery) {
        query = query.where(sql `to_tsvector('english', products.name || ' ' || categories.name)`, '@@', sql `plainto_tsquery('english', ${finalSearchQuery})`);
    }
    if (category && typeof category === 'string') {
        query = query.where('categories.slug', 'ilike', `%${category}%`);
    }
    if (parsedMinPrice !== undefined) {
        query = query.where('products.price', '>=', parsedMinPrice);
    }
    if (parsedMaxPrice !== undefined) {
        query = query.where('products.price', '<=', parsedMaxPrice);
    }
    if (minDiscount && typeof minDiscount === 'string') {
        query = query.where(sql `((products.mrp - products.price) * 100.0 / products.mrp)`, '>=', parseFloat(minDiscount));
    }
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;
    let orderColumn = 'products.created_at';
    let orderDirection = 'desc';
    if (sortBy === 'price') {
        orderColumn = 'products.price';
    }
    else if (sortBy === 'discount') {
        orderColumn = sql `((products.mrp - products.price) * 100.0 / products.mrp)`;
    }
    if (sortOrder === 'asc') {
        orderDirection = 'asc';
    }
    else if (sortOrder === 'desc') {
        orderDirection = 'desc';
    }
    const products = await query
        .orderBy(orderColumn, orderDirection)
        .limit(limitNum)
        .offset(offset)
        .execute();
    let countQuery = db
        .selectFrom('products')
        .innerJoin('categories', 'categories.id', 'products.category_id')
        .select(db.fn.countAll().as('total'));
    if (finalSearchQuery) {
        countQuery = countQuery.where(sql `to_tsvector('english', products.name || ' ' || categories.name)`, '@@', sql `plainto_tsquery('english', ${finalSearchQuery})`);
    }
    if (category && typeof category === 'string') {
        countQuery = countQuery.where('categories.slug', 'ilike', `%${category}%`);
    }
    if (parsedMinPrice !== undefined) {
        countQuery = countQuery.where('products.price', '>=', parsedMinPrice);
    }
    if (parsedMaxPrice !== undefined) {
        countQuery = countQuery.where('products.price', '<=', parsedMaxPrice);
    }
    if (minDiscount && typeof minDiscount === 'string') {
        countQuery = countQuery.where(sql `((products.mrp - products.price) * 100.0 / products.mrp)`, '>=', parseFloat(minDiscount));
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
    });
};
export const getProductById = async (req, res) => {
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
export const getSearchSuggestions = async (req, res) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.trim() === '') {
        res.json({ status: 'success', data: [] });
        return;
    }
    const suggestions = await db
        .selectFrom('categories')
        .select('name')
        .where('name', 'ilike', `%${q}%`)
        .limit(8)
        .execute();
    res.json({
        status: 'success',
        data: suggestions.map(s => s.name)
    });
};
//# sourceMappingURL=productController.js.map