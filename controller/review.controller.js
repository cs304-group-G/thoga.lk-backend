import Review from "../models/review.model.js";

const addReview = async (req, res) => {
  const productId = req.params.id;
  const { message, rating } = req.body;
  const reviewerId = req.user._id;

  const review = new Review({
    message: message,
    rating: rating,
    reviewerId: reviewerId,
    productId: productId,
  });

  review
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

const getReviews = async (req, res) => {
  const productId = req.params.id;

  Review.find({ productId: productId })
    .populate("reviewerId")
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

export { addReview, getReviews };