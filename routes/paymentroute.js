import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
  razorpayWebhook,
} from "../controllers/Payment.js";
import { requireAuth } from "../middlewares/Authentication.js";

const router = express.Router();

router.post("/create-order", requireAuth, createPaymentOrder);
router.post("/verify", requireAuth, verifyPayment);
router.post("/webhook", express.raw({ type: "application/json" }), razorpayWebhook);

export default router;
