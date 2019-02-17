const router = require("express").Router();
const passport = require("../config/passport");
const User = require("../models/user");

router.post("/login", passport.authenticate("local"), (req, res, next) => {
    res.json({
        success: true,
        msg: "User logged in",
        userStatus: req.user.status
    });
})

router.post("/register", (req, res) => {
    if (!(req.body.username && req.body.password)) {
        res.json({ success: false, msg: "Please pass username and password." });
    } else {
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
            status: "contributor"
        });

        
        newUser.save(err => {
            if (err) {
                return res.json({ success: false, msg: "Failed to create account. Please try a different username and password." })
            }
            res.json({ success: true, msg: "Successfully created a new user." });
        });

    }
});

router.get("/status", (req, res) => {
    if (req.user) {
        return res.json({status: req.user.status});
    } else {
        return res.json({status: "visitor"});
    }
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
})
module.exports = router;