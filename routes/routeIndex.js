const router = require("express").Router(),
    authRoutes = require("./auth"),
    gameRoutes = require("./games");


// these will be added to /api/<path>
router.use("/api/games", gameRoutes);
router.use("/api/auth", authRoutes);

router.use(function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;