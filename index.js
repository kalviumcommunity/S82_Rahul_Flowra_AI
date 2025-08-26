import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import zeroShotRoutes from "./routes/zeroShotRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Use Zero-Shot Routes
app.use("/api/zeroshot", zeroShotRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Zero-Shot Backend running on http://localhost:${PORT}`)
);
