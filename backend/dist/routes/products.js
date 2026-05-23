import { Router } from "express";
import { getAllProducts, getProductById, getSearchSuggestions } from "../controllers/productController.js";
const router = Router();
router.get('/', getAllProducts);
router.get('/search-suggestions', getSearchSuggestions);
router.get('/:id', getProductById);
export default router;
//# sourceMappingURL=products.js.map