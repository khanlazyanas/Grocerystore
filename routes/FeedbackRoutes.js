// routes/feedbackRoutes.js
import express from "express";
import { getFeedback, submitFeedback } from "../controllers/feedback.js";


const router = express.Router();

// Endpoint to get all feedback (testimonials)
router.get("/", getFeedback);

// Endpoint to submit feedback (rating & review)
router.post("/", submitFeedback);

export default router;
