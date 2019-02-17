const User = require("../models/user");

module.exports = {
    findOne: (req, res) => {
            User.findById(req.user.id)
            .populate("games")
            .then(dbUser => res.json(dbUser.games))
            .catch(err => res.status(422).json(err));
        },
}