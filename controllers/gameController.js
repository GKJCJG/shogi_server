const Game = require("../models/game");
const mailer = require("../config/nodemailer");

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
        .then(dbGame => {
            mailer.alertCreated(dbGame, "sente");
            mailer.alertCreated(dbGame, "gote");
            res.json(dbGame)
        })
        .catch(err => res.status(422).json(err));
    },
    addMove: (req, res) => {
        Game.findOne(
            {$or: 
                [{senteAccess: req.params.id}, {goteAccess: req.params.id}]
            })
            .then(dbGame => {
                const lastMove = dbGame.moves[dbGame.moves.length - 1];
                const newMove = req.body.move;
                
                if (lastMove === newMove) return res.status(422).json({err: "You've tried to make the same move twice!"})

                dbGame.moves.push(newMove);

                dbGame.save()
                .then(dbGame => {
                    mailer.alertMover(dbGame, req.body.alert);
                    res.json(dbGame);
                })
                .catch(err => res.status(422).json(err));
            })
            .catch(err => res.status(422).json(err));
    },
    updateOne: (req, res) => {
        Game.findOneAndUpdate(
            {$or: 
                [{senteAccess: req.params.id}, {goteAccess: req.params.id}]
            },
            {$set: req.body.action}
        )
        .then(dbGame => {
            mailer.alertMover(dbGame, req.body.alert);
            res.json(dbGame);
        })
        .catch(err => res.status(422).json(err));
    },
    // delete games that haven't been modified in more than 30 days.
    deleteStale: () => {
        Game.find({})
    }
}