const router = require("express").Router();
const gameController = require("../controllers/gameController");

router.route("/new")
  .post(gameController.create)
  .get((req, res) => res.send("Hello."));

router.route("/:id")
  .get(gameController.findOne)
  .put(gameController.updateOne);

router.route("/:id/:field")
  .post(gameController.addArrayItem);

router.route("/cleanup")
  .delete(gameController.deleteStale);

module.exports = router;