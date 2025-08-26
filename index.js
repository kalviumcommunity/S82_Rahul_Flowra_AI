import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import zeroShotRoutes from "./routes/zeroShotRoutes.js";
import oneShotRoutes from "./routes/oneShotRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Use Routes
app.use("/api/zeroshot", zeroShotRoutes);
app.use("/api/oneshot", oneShotRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
