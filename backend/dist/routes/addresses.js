import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getAddresses, addAddress, deleteAddress } from "../controllers/addressController.js";
const router = Router();
router.use(authenticate);
router.get("/", getAddresses);
router.post("/", addAddress);
router.delete("/:id", deleteAddress);
export default router;
//# sourceMappingURL=addresses.js.map