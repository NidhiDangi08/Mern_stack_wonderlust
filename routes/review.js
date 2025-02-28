
const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js")


// Validation of review
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body); // Validate the review using the schema
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", "); // Get error messages
    throw new ExpressError(400, errMsg); // Pass error to the ExpressError handler
  } else {
    next();
  }
};

const reviewController = require("../controllers/reviews.js")

// Add Review
router.post("/", isLoggedIn,validateReview,wrapAsync(reviewController.createReview)
);

// Delete Review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
