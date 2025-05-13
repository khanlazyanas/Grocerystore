import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  items: [],
  total: Number,
  phoneNumber: String,
  address: String,
  paymentMethod: String, // "COD" or "Online"
  status: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
