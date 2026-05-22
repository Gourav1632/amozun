import type { Request, Response, NextFunction } from "express";
import { db } from '../db/index.js';

export const getAllCategories = async (_req: Request, res: Response) => {
    const categories = await db
        .selectFrom('categories')
        .selectAll()
        .orderBy('name', 'asc')
        .execute();

    res.json({
        status: 'success',
        data: categories
    });
}