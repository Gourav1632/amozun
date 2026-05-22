import { Router } from "express";
import { addToCart, getCart, updateCartItem, removeFromCart } from "../controllers/cartController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);

router.get('/', getCart);

router.post('/', addToCart);

router.patch('/:itemId', updateCartItem);

router.delete('/:itemId', removeFromCart);

export default router;