// Load .env file properly in ESM
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Import necessary modules
import Razorpay from "razorpay";
import crypto from "crypto";
import { Order } from "../models/Order.js";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
export const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Razorpay Order Failed",
      error: err.message,
    });
  }
};

// Verify Razorpay Payment (from frontend)
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

      res.status(200).json({
        success: true,
        message: "Payment Verified & Order Placed",
        order: newOrder,
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid Signature" });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Payment Verification Failed",
      error: err.message,
    });
  }
};

// ✅ Webhook Handler from Razorpay
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

      // ✅ TODO: Add your logic here to save the order or mark payment as successful
      // Example: find related order by order_id or metadata
      console.log("✅ Payment Captured via Webhook: ", payment.id);

      // Example basic logic (update if you want to save order here):
      /*
      await Order.updateOne(
        { razorpayOrderId: payment.order_id },
        { status: "Paid" }
      );
      */
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
