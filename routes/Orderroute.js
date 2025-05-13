import express from "express";
import { requireAuth } from "../middlewares/Authentication.js";
import { placeCODOrder } from "../controllers/Order.js";

const router = express.Router();

router.post("/cod", requireAuth, placeCODOrder);

export default router;
