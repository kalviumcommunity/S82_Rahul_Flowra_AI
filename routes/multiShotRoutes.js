import express from "express";
import { generateMultiShot } from "../controllers/multiShotController.js";

const router = express.Router();

// ✅ Multi-Shot Route
router.post("/generate", generateMultiShot);

export default router;
