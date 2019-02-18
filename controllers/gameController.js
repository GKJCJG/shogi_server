const Game = require("../models/game");

module.exports = {
    findOne: (req, res) => {
        Game.findById(req.params.id)
        .then(dbGame => res.json(dbGame))
        .catch(err => res.status(422).json(err));
    },
    create: (req, res) => {
        Game.create(req.body)
        .then(dbGame => res.json(dbGame))
        .catch(err => res.status(422).json(err));
    },
    updateOne: (req, res) => {
        console.log(req.body, req.body.move);
        Game.findOneAndUpdate(
                {$or: 
                    [{senteAccess: req.params.id}, {goteAccess: req.params.id}]
                },
                {$push: {"moves": req.body.move}}
            )
        .then(dbGame => res.json(dbGame))
        .catch(err => res.status(422).json(err));
    },
    // delete games that haven't been modified in more than 30 days.
    deleteStale: () => {
        Game.find({})
    }
}