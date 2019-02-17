const Game = require("../models/game");

module.exports = {
    findOne: (req, res) => {
        Game.findById(req.params.id)
        .then(dbGame => res.json(dbGame))
        .catch(err => res.status(422).json(err));
    },
    // delete games that haven't been modified in more than 30 days.
    deleteStale: () => {
        Game.find({})
    }
}