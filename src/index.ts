import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import customerRoutes from "./routes/customers";
import orderRoutes from "./routes/orders";
import employeeRoutes from "./routes/employees";
import paymentRoutes from "./routes/payments";
import dashboardRoutes from "./routes/dashboard";
import reportsRoutes from "./routes/reports";
import uploadRoutes from "./routes/upload";
import expenseRoutes from "./routes/expenses";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Terzi App API çalışıyor 🎉" });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});

export default app;