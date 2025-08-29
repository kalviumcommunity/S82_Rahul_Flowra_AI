// routes/temperatureRoutes.js
import express from "express";
import { generateWithTemperature } from "../controllers/temperatureController.js";

const router = express.Router();

// POST /api/temperature
router.post("/", generateWithTemperature);

export default router;
