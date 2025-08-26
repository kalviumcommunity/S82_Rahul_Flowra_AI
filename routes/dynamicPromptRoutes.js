import express from "express";
import { generateDynamicPrompt } from "../controllers/dynamicPromptController.js";

const router = express.Router();

// ✅ Dynamic Prompt Route
router.post("/generate", generateDynamicPrompt);

export default router;
