// TODO struggling with .env, so having to put it here...
const envKey = require("dotenv").config();
module.exports = {
  user: process.env.EMAIL_USERNAME,
  pass: process.env.EMAIL_PASSWORD
};

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routeIndex");
const passport = require("passport");
const expressSession = require("express-session");

const app = express();
const PORT = process.env.PORT || 3001;

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
app.use(routes);

app.use(expressSession({secret: "afhamon", resave: true, saveUninitialized: false }))
//passport
app.use(passport.initialize());
app.use(passport.session());




// Connect to the Mongo DB
mongoose.set("useCreateIndex", true);
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/shogiserver", {useNewUrlParser: true}
);

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});