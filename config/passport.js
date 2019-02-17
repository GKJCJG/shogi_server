const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt-nodejs');

const db = require("../models/user");

passport.use(new LocalStrategy(
  {
    usernameField: "username",
    passwordField: "password"
  },
  
  function(username, password, done){
      username = username.toLowerCase();

      db.findOne({username})
        .then(user => {
          //if user was returned, need to check the passwords
          if(user){
            bcrypt.compare(password, user.password, function(err, res) {
              // res == true
              if (res) return done(null, user);
              else return done(null, false); // Originally read (done, null, false), but I don't think that can be right.
            });
          }
          else{
            console.log("user not found");
            return done(null, false); // Originally read (done, null, false), but I don't think that can be right.
          }
        })
        .catch( err => {
          console.log("found One false");
          return done(null, false); // Originally read (done, null, false), but I don't think that can be right.
        })
  }
))

passport.serializeUser(function(user, cb){
  cb(null, user);
});
passport.deserializeUser(function(obj, cb){
  cb(null, obj);
});


module.exports = passport;