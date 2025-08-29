// routes/promptRoutes.js
import express from "express";
import { systemUserPrompt } from "../controllers/promptController.js";

const router = express.Router();

// POST /api/prompt/system-user
router.post("/system-user", systemUserPrompt);

export default router;
