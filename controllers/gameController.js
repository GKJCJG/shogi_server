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
        .catch(err => {
            console.log("Failed to create game because:", err);
            res.status(422).json(err)
        });
    },
    addArrayItem: (req, res) => {
        const parseNewItem = (req) => {
            const field = req.params.field;
            const singular = field.substring(0, field.length-1);
            const addition = req.body[singular];
            const id = req.params.id
            return {field, addition, id};
        }
        const isDuplicate = (document, field, addition) => {
            const previousItem = document[field][document[field].length - 1];
            const newItem = addition;
            
            if (previousItem === newItem) return true;
            return false;
        }

        let {field, addition, id} = parseNewItem(req);

        Game.findOne({$or: [{senteAccess: id}, {goteAccess: id}]})
            .then(dbGame => {

                if(isDuplicate(dbGame, field, addition)) return res.status(422).json({err: "You've already done that once!"});

                dbGame[field].push(addition);
                dbGame.save()
                .then(dbGame => {
                    if (field === "moves") mailer.alertMover(dbGame, req.body.alert);
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
    deleteStale: (req, res, next) => {
        const today = new Date(Date.now());
        const aMonthAgo = new Date(today.getFullYear(), today.getMonth()-1, today.getDate());
        Game.deleteMany({updatedAt: {$lt: aMonthAgo}})
        .then(dbDeletions => console.log(dbDeletions))
        .catch(err => console.log(err));

        next();
    }
}