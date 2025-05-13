// controllers/Feedback.js
import {RatingFeedback} from "../models/Ratingfeedback.js";

// Get all customer feedback (testimonials)
export const getFeedback = async (req, res) => {
  try {
    const feedbacks = await RatingFeedback.find().populate("userId", "name");

    res.status(200).json({ success: true, feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching feedback", error: err.message });
  }
};

// Submit customer feedback (rating & review)
export const submitFeedback = async (req, res) => {
  try {
    const { userId, feedback, rating } = req.body;

    const newFeedback = new RatingFeedback({
      userId,
      feedback,
      rating,
    });

    await newFeedback.save();

    res.status(201).json({ success: true, message: "Feedback submitted successfully", feedback: newFeedback });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error submitting feedback", error: err.message });
  }
};
