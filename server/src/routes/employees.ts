import { Router } from "express";
import { getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee, getEmployeeOrders } from "../controllers/employeeController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", getEmployees);
router.get("/:id", getEmployee);
router.get("/:id/orders", getEmployeeOrders);
router.post("/", createEmployee);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;