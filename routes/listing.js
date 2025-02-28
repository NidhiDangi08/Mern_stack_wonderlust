 const express = require("express");
 const router = express.Router();
 const wrapAsync = require("../utils/wrapAsync.js");
 const { listingSchema} = require("../schema.js");
 const ExpressError = require("../utils/ExpressError.js");
 const Listing = require("../models/listing.js");
 const {isLoggedIn, isOwner} = require("../middleware.js")

 
// Listing Validation Middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);  // Validate the listing using the schema
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");  // Get error messages
    return next(new ExpressError(400, errMsg));  // Pass error to the ExpressError handler
  }
  next();
};
 const listingController = require("../controllers/listings.js")

 const multer  = require('multer')
 const {storage} = require("../cloudconfig.js")
 const upload = multer({storage}); 


//index and create routs
 router.route("/")
 .get( wrapAsync(listingController.index))
 .post(isLoggedIn,
  upload.single('listing[image]'),
  // validateListing,
  wrapAsync(listingController.createListing))
  
  // New Listing Form
  router.get("/new", isLoggedIn,listingController.renderNewForm);





 //delete update show route
 router.route("/:id")
 .get(wrapAsync(listingController.showListing) )
 .put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing))
 .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))



  
  // Edit Listing Form
  router.get(
    "/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));
  



module.exports=router;
  
  
  
  
  
  
  
  
  