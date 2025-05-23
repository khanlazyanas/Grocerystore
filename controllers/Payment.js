import dotenv from "dotenv";
dotenv.config();

import Razorpay from "razorpay";
import crypto from "crypto";
import { Order } from "../models/Order.js";

// 🔐 Razorpay init
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (err) {
    console.error("Create Razorpay Order Error:", err);
    res.status(500).json({
      success: false,
      message: "Razorpay Order Failed",
      error: err.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      total,
      phoneNumber,
      address,
    } = req.body;

    const sign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (sign === razorpay_signature) {
      const newOrder = await Order.create({
        userId: req.userId,
        items,
        total,
        phoneNumber,
        address,
        paymentMethod: "Online",
        status: "Paid",
      });

      return res.status(200).json({
        success: true,
        message: "Payment Verified & Order Placed",
        order: newOrder,
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid Signature" });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Payment Verification Failed",
      error: err.message,
    });
  }
};

export const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    const body = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(body))
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ success: false, message: "Invalid webhook signature" });
    }

    const event = body.event;

    if (event === "payment.captured") {
      const payment = body.payload.payment.entity;
      console.log("✅ Payment Captured via Webhook:", payment.id);
    }

    res.status(200).json({ success: true, message: "Webhook processed" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
      error: err.message,
    });
  }
};
