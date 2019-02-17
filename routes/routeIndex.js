const router = require("express").Router(),
    authRoutes = require("./auth");
    gameRoutes = require("./games");


// these will be added to /api/<path>
router.use("/api/games", gameRoutes);
router.use("/api/auth", authRoutes)

module.exports = router;