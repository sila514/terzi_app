import { Router } from "express";
import { getOrderPayments, createPayment, deletePayment } from "../controllers/paymentController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/order/:orderId", getOrderPayments);
router.post("/", createPayment);
router.delete("/:id", deletePayment);

export default router;