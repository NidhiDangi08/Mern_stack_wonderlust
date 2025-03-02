// if(process.env.NODE_ENV != "production"){
// require('dotenv').config()
// }




// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const ExpressError = require("./utils/ExpressError.js");

// const listingRouter = require("./routes/listing.js");
// const reviewRouter = require("./routes/review.js"); 
// const userRouter = require("./routes/user.js"); 


 


//  const dbUrl=process.env.ATLASDB_URL; 

// const session = require("express-session") 
// const MongoStore= require('connect-mongo');
// const flash = require("connect-flash");
// const passport= require("passport");
// const LocalStrategy = require("passport-local");
// const user=require("./models/user.js");



// // Connect to MongoDB
// async function main() {
//   try {
//     await mongoose.connect(dbUrl);
//     console.log("Connected to the database");
//   } catch (err) {
//     console.error("Error connecting to the database:", err);
//   }
// }
// main();

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.engine("ejs", ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));






// app.get("/", (req, res) => {
//   res.send("Hi, I am the root");
// });


//  const store = MongoStore.create({
//   mongoUrl:dbUrl,
//   crypto:{
//     secret:process.env.SECRET,
//   },

//    touchAfter: 24 *3600,
//  });

//  store.on("error",()=>{
// console.log("ERROR in MONGO SESSION STORE",err);
//  });




//  const sessionOptions={
//   store,
//   secret:process.env.SECRET,
//   resave : false,
//   saveUninitialized:true,
//   Cookie:{
//     expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     httpOnly: true,


//   },
// };

// app.use(session(sessionOptions));
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(user.authenticate())); 

// passport.serializeUser(user.serializeUser());
// passport.deserializeUser(user.deserializeUser());


// app.use((req,res,next)=>{
//   res.locals.success=req.flash("success");
//   res.locals.error=req.flash("error");
//   // console.log(res.locals.success); 
//   res.locals.currUser = req.user;
//   next();
// });





// app.use ("/listings", listingRouter);
// app.use("/listings/:id/reviews",reviewRouter);
// app.use("/",userRouter);
// // Error Handling Middleware
// app.use((err, req, res, next) => {
//   const { status = 500, message = "Something went wrong!" } = err;
//   console.error("Error:", err);
//   res.status(status).render("error", { status, message });
// });

// // 404 Error Middleware
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page not found!"));
// });

// // Start Server
// app.listen(8080, () => {
//   console.log("Server running on port 8080");
// });

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");

// Import Routers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// Database Connection
const dbUrl = process.env.ATLASDB_URL || "mongodb://localhost:27017/mydatabase";

async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to the database");

    // Use routes after DB connection
    app.use("/listings", listingRouter);
    app.use("/listings/:id/reviews", reviewRouter);
    app.use("/", userRouter);

    // 404 Middleware
    app.all("*", (req, res, next) => {
      next(new ExpressError(404, "Page not found!"));
    });

    // Start Server
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

main();

// View Engine & Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.resolve(__dirname, "public")));

// Session Store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET || "fallbacksecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// Flash Messages Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Root Route
app.get("/", (req, res) => {
  res.send("Hi, I am the root");
});
