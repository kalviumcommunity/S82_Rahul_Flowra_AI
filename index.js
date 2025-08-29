import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import zeroShotRoutes from "./routes/zeroShotRoutes.js";
import oneShotRoutes from "./routes/oneShotRoutes.js";
import multiShotRoutes from "./routes/multiShotRoutes.js";
import dynamicPromptRoutes from "./routes/dynamicPromptRoutes.js";
import chainOfThoughtRoutes from "./routes/chainOfThoughtRoutes.js";
import structuredRoutes from "./routes/structuredOutputRoutes.js";
import promptRoutes from "./routes/promptRoutes.js";
import temperatureRoutes from "./routes/temperatureRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Use Routes
app.use("/api/zeroshot", zeroShotRoutes);
app.use("/api/oneshot", oneShotRoutes);
app.use("/api/multishot", multiShotRoutes);
app.use("/api/dynamic", dynamicPromptRoutes);
app.use("/api/chainofthought", chainOfThoughtRoutes); 
app.use("/api/structured", structuredRoutes);
app.use("/api/prompt", promptRoutes);
app.use("/api/temperature", temperatureRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
