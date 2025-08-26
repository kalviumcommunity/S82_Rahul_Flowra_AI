// tests/evaluation.test.js
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { judgePrompt } from "../judgePrompt.js"; // adjust path if needed

// __dirname workaround in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load dataset
const datasetPath = path.join(__dirname, "../dataset.json");
const dataset = JSON.parse(fs.readFileSync(datasetPath, "utf-8"));

// Base URL of your backend
const BASE_URL = "http://localhost:5000/api/zeroshot"; // change endpoint if testing one-shot etc.

describe("Evaluation Dataset Testing", () => {
  for (const sample of dataset) {
    const input = {
      domain: sample.domain,
      task: sample.task,
      tone: sample.tone,
      constraints: sample.constraints
    };

    test(`Evaluate AI output for domain: "${sample.domain}" & task: "${sample.task}"`, async () => {
      const response = await axios.post(`${BASE_URL}/generate`, input);
      const aiOutput = response.data.result;

      // Run judge prompt
      const verdict = judgePrompt(aiOutput, sample);

      // Check verdict
      console.log(`Feedback for ${sample.domain}:`, verdict.feedback);
      expect(verdict.passed).toBe(true);
    });
  }
});
