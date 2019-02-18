const Game = require("../models/game");

module.exports = {
    findOne: (req, res) => {
        Game.findOne({$or: 
            [{senteAccess: req.params.id}, {goteAccess: req.params.id}]
        })
        .select("-senteContact -goteContact")
        .then(dbGame => res.json(dbGame))
        .catch(err => res.status(422).json(err));
    },
    create: (req, res) => {
        Game.create(req.body)
        .then(dbGame => res.json(dbGame))
        .catch(err => res.status(422).json(err));
    },
    updateOne: (req, res) => {
        Game.findOneAndUpdate(
            {$or: 
                [{senteAccess: req.params.id}, {goteAccess: req.params.id}]
            },
            {$push: {"moves": req.body.move}}
        )
        .select("-senteContact -goteContact")
        .then(dbGame => res.json(dbGame))
        .catch(err => res.status(422).json(err));
    },
    // delete games that haven't been modified in more than 30 days.
    deleteStale: () => {
        Game.find({})
    }
}