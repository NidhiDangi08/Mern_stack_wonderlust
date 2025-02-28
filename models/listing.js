const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review.js");

// Define the Listing schema
const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String, // Use String (capitalized) instead of string
    required: true,
  },
  country: {
    type: String, // Use String (capitalized) instead of string
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review", // You may want to add the ref to the 'Review' model if this is what it's referencing
  }],
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

//REVIEW DELTE  
listingSchema.post("findOneAndDelete", async(listiing)=>{
  if(listiing){
     Review.deleteMany({_id:{$in:listiing.reviews}});


  }
  
});







// Create the Listing model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
