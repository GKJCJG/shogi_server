const router = require("express").Router();
const searchController = require("../controllers/gameController");

// Matches with "/api/aggregate"
// router.route("/")
//   .get(searchController.getOptions);
// //   .post(parseController.create);

// router.route("/passages")
//   .get((req, res) => {
//     const {language, type, subtype, prefix} = req.query;
//     const PC = passageController;
//     switch (type) {
//       case "Lexical type":
//       return PC.passagesByType(subtype, res);
//       case "Derivational type":
//       return PC.passagesByPrefix(prefix, res);
//       case "Exact form":
//       return PC.passagesByToken(subtype, res);
//     }
//   })
// Matches with "/api/submissions/:id"
// router
//   .route("/:id")
// //   .get(parseController.findById)
//   .put(parseController.confirm)
//   .delete(parseController.remove);

module.exports = router;