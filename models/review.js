const { number } = require("joi");
const mongoose = require("mongoose");
const { create } = require("./listing");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,  // Change 'string' to 'String'
        required: true  // Optionally, you can add 'required' to ensure the comment is provided
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true  // Optionally, make rating a required field
    },
    createdAt: {
        type: Date,
        default: Date.now  // Fixed typo 'defoult' to 'default'
    },
    author:{
       type: Schema.Types.ObjectId,
        ref: "User",
    }
});

module.exports = mongoose.model("Review", reviewSchema);
