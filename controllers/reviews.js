const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview=async (req, res) => {
    const listing = await Listing.findById(req.params.id); // Find the listing by ID
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }

    const newReview = new Review(req.body.review);
     // Create a new review
     newReview.author = req.user._id;
     console.log(newReview);
    listing.reviews.push(newReview); // Push the review into the listing's reviews array

    await newReview.save(); // Save the review
    await listing.save(); // Save the listing with the updated reviews
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`); // Redirect to the listing's page
  }


  module.exports.destroyReview = async (req, res) => {
      const { id, reviewId } = req.params;
  
      const listing = await Listing.findById(id); // Find the listing by ID
      if (!listing) {
        throw new ExpressError(404, "Listing not found");
      }
  
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove the review reference from the listing
      await Review.findByIdAndDelete(reviewId); // Delete the review
      req.flash("success","Review Deleted");
      res.redirect(`/listings/${id}`); // Redirect to the listing's page
    }