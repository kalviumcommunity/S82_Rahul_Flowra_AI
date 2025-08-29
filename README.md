#  Flowra AI

Flowra AI is an **AI-powered design assistant** built for **UI/UX developers**. It helps designers and developers quickly generate **UI concepts, design flows, and feature ideas** based on simple prompts.

Whether you’re building a **chess app**, an **e-commerce site**, or a **social platform**, Flowra AI provides **structured UI/UX suggestions** — from **page layouts and color palettes** to **feature lists and navigation flows**.

---

## 🧠 Project Concept

Flowra AI is designed to:
- Generate **UI concepts** from natural language prompts (e.g., "Build me a chess website UI").
- Suggest **color palettes, themes, and typography** for consistent branding.
- Provide **page-by-page wireframe ideas** (homepage, dashboard, settings, etc.).
- Break down **settings & feature lists** into structured categories.
- Help developers brainstorm faster with **ready-to-use UI flows**.

---

## ✅ Features Implemented

- **Prompting**: Zero-shot / One-shot / Multi-shot / Dynamic / Chain-of-thought prompting endpoints.
- **Structured Output**: Model instructed to return strict JSON schema; AJV validation & repair retry included.
- **Design Flows**: Navigation & page suggestions returned as arrays for easy rendering.
- **Component Suggestions**: Recommendations oriented to popular frameworks (React + Tailwind).
- **Token Logging**: Token counting & logging for each request/response (via `utils/tokenUtils.js`).
- **Evaluation & Testing**: Small evaluation dataset + Jest-based test runner and judge function.
- **Temperature / Top-P / Top-K / Stop Sequences**: Sampling controls exposed via endpoints.
- **Evaluation Metrics**: Basic completeness & palette checks for generated outputs.

---

## 📦 Tech Stack

- **Frontend:** React.js / Next.js (recommended)
- **Backend:** Node.js + Express (ESM)
- **AI Engine:** OpenRouter / LLM endpoints (example: mistralai/mistral-7b-instruct)
- **Database (optional):** MongoDB (for storing prompts & results)
- **Deployment:** Vercel (frontend), Render / Render-like (backend)

---

## 📁 File / Folder Structure

