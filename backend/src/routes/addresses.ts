import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getAddresses, addAddress, deleteAddress, updateAddress, setDefaultAddress } from "../controllers/addressController.js";

const router = Router();
router.use(authenticate);

router.get("/", getAddresses);
router.post("/", addAddress);
router.delete("/:id", deleteAddress);
router.put("/:id", updateAddress);
router.put("/:id/default", setDefaultAddress);

export default router;
