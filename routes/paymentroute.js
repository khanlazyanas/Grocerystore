import express from "express";
import { requireAuth } from "../middlewares/Authentication.js";
import {
  createPaymentOrder,
  verifyPayment,
  razorpayWebhook
} from "../controllers/Payment.js";

const router = express.Router();

router.post("/create-order", requireAuth, createPaymentOrder);
router.post("/verify", requireAuth, verifyPayment);

// Webhook route — no auth
router.post("/webhook", express.raw({ type: "application/json" }), razorpayWebhook);

export default router;
