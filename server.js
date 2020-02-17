const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routeIndex");
const passport = require("passport");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo")(expressSession);

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to the Mongo DB
mongoose.set("useCreateIndex", true);
const mongooseConnectionPromise = mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/shogiserver", { useNewUrlParser: true, useUnifiedTopology: true }
);

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
app.use(routes);

app.use(expressSession({
  secret: "afhamon",
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
//passport
app.use(passport.initialize());
app.use(passport.session());





// Start the API server
mongooseConnectionPromise
  .then(() => {
    app.listen(PORT, function () {
      console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
    });
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  })