import { db } from '../db/index.js';
export const getAllCategories = async (_req, res) => {
    const categories = await db
        .selectFrom('categories')
        .selectAll()
        .orderBy('name', 'asc')
        .execute();
    res.json({
        status: 'success',
        data: categories
    });
};
//# sourceMappingURL=categoryController.js.map