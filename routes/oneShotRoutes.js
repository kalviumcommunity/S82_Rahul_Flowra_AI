import express from "express";
import { generateOneShot } from "../controllers/oneShotController.js";

const router = express.Router();

// ✅ One-Shot Route
router.post("/generate", generateOneShot);

export default router;
