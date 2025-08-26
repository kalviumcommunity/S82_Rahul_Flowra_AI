import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import zeroShotRoutes from "./routes/zeroShotRoutes.js";
import oneShotRoutes from "./routes/oneShotRoutes.js"; // ✅ import one-shot routes

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Use Routes
app.use("/api/zeroshot", zeroShotRoutes);
app.use("/api/oneshot", oneShotRoutes); // ✅ new endpoint

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
