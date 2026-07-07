import { Router } from "express";
import { getSummary, getMonthly } from "../controllers/reportsController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/summary", getSummary);
router.get("/monthly", getMonthly);

export default router;