import express from "express";
import Connectdb from "./config/database.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import authroutes from "./routes/authroutes.js";
import productroutes from "./routes/productroute.js";
import cartroutes from "./routes/cartroute.js";
import orderroutes from "./routes/Orderroute.js";
import paymentroutes from "./routes/paymentroute.js";
import feedbackRoutes from "./routes/FeedbackRoutes.js"

// Config
dotenv.config();
const app = express();

// CORS & Cookie Parser
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(cookieParser());

// ✅ Special middleware for Razorpay webhook route — must be raw
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

// 🔄 Regular JSON middleware for other routes
app.use(express.json());

// Routes
app.use("/api/auth", authroutes);
app.use("/api/products", productroutes);
app.use("/api/cart", cartroutes);
app.use("/api/order", orderroutes);
app.use("/api/payment", paymentroutes);
app.use("/api/feedback",feedbackRoutes)

// DB Connect
Connectdb();

// Default Route
app.get("/", (req, res) => {
  res.send("Working");
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on Port ${process.env.PORT}`);
});
