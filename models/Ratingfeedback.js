// models/RatingFeedback.js
import mongoose from "mongoose";

const RatingFeedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model for referencing the user
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Assuming rating scale is from 1 to 5
    },
  },
  {
    timestamps: true, // To automatically add createdAt and updatedAt fields
  }
);

export const RatingFeedback = mongoose.model("RatingFeedback", RatingFeedbackSchema);


