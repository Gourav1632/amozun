import type { Request, Response, NextFunction } from "express";
import { db } from '../db/index.js';
import { redisClient } from '../db/redis.js';
import { logger } from '../utils/logger.js';

export const getAllCategories = async (_req: Request, res: Response) => {
    try {
        const cached = await redisClient.get('categories:all');
        if (cached) {
            return res.json({
                status: 'success',
                data: JSON.parse(cached)
            });
        }
    } catch (err) {
        logger.error('Redis cache error: ', err);
    }

    const categories = await db
        .selectFrom('categories')
        .selectAll()
        .orderBy('name', 'asc')
        .execute();

    try {
        await redisClient.setEx('categories:all', 86400, JSON.stringify(categories)); // 24 hours
    } catch (err) {
        logger.error('Redis cache error: ', err);
    }

    res.json({
        status: 'success',
        data: categories
    });
}