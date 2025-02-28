const mongoose = require("mongoose");
const initData = require("./data.js"); // Assuming data.js exports an array of data
const Listing = require("../models/listing.js"); // Correct path to your Listing model

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; // MongoDB connection URL

// Connect to MongoDB
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to the database"); // Ensure MongoDB server is running
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit process on failure
  }
}

// Initialize the database
const initDB = async () => {
  try {
    // Clear existing data
    await Listing.deleteMany({});
    console.log("Existing data cleared");
    initData.data= initData.data.map((obj)=>({
    ...obj,
    owner: "679b79100ae63e022c7274d3"
     }));

    // Insert initial data
    await Listing.insertMany(initData.data); // Pass initData directly
    console.log("Data has been initialized successfully");
  } catch (err) {
    console.error("Error initializing data:", err.message);
  }
};

// Connect and initialize the database
main().then(() => initDB());
