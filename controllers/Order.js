import { Order } from "../models/Order.js";

export const placeCODOrder = async (req, res) => {
  try {
    const { items, total, phoneNumber, address } = req.body;

    const newOrder = await Order.create({
      userId: req.userId,
      items,
      total,
      phoneNumber,
      address,
      paymentMethod: "COD",
      status: "Pending",
    });

    res.status(201).json({ success: true, message: "COD Order Placed", order: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: "COD Order Failed", error: err.message });
  }
};
