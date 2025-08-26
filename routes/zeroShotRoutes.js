import express from "express";
import { generateZeroShot } from "../controllers/zeroShotController.js";

const router = express.Router();

// ✅ Zero-Shot Route
router.post("/generate", generateZeroShot);

export default router;
