// routes/structuredOutputRoutes.js
import express from "express";
import { generateStructuredOutput } from "../controllers/structuredOutputController.js";

const router = express.Router();
router.post("/generate", generateStructuredOutput);

export default router;
