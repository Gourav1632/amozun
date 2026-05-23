import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { addRecentlyViewed, getRecentlyViewed } from "../controllers/recentlyViewedController.js";

const router = Router();

router.use(authenticate);

router.post('/', addRecentlyViewed);
router.get('/', getRecentlyViewed);

export default router;
