import { Router } from "express";
import { placeOrder, getMyOrders, getOrderById, } from "../controllers/orderController.js";
import { authenticate } from "../middleware/auth.js";
const router = Router();
router.use(authenticate);
router.post("/", placeOrder);
router.get("/", getMyOrders);
router.get("/:id", getOrderById);
export default router;
//# sourceMappingURL=orders.js.map