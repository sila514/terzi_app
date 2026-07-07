import { Router } from "express";
import { getOrders, getOrder, createOrder, updateOrder, updateOrderStatus, deleteOrder, getOverdueOrders } from "../controllers/orderController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", getOrders);
router.get("/overdue", getOverdueOrders);
router.get("/:id", getOrder);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.patch("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;