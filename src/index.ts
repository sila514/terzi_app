import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import expenseRoutes from "./routes/expenses";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Terzi App API çalışıyor 🎉" });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});

export default app;