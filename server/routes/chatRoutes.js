import express from "express";
import { chatWithAI, createResume } from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat", chatWithAI);
router.post("/resume", createResume);

export default router;
