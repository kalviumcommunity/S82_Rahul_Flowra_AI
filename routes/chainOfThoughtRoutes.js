import express from "express";
import { generateChainOfThought } from "../controllers/chainOfThoughtController.js";

const router = express.Router();

// ✅ CoT Route
router.post("/generate", generateChainOfThought);

export default router;
