const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
    drawOffer: {
        type: String,
        required: false
    },
    resigned: {
        type: String,
        required: false
    },
    winner: {
        type: String,
        required: false
    },
    handicap: String,
    moves: [{
        type: String,
    }],
    senteContact: {
        type: String,
        validate: {
            validator: function(email) {
                const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
              return emailRegex.test(email);
            },
          },
          required: [true, 'Email required.']
        },
    goteContact: {
        type: String,
        validate: {
            validator: function(email) {
                const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
              return emailRegex.test(email);
            },
          },
          required: [true, 'Email required.']
        },
    senteNick: String,
    goteNick: String,
    senteAccess: {
        type:Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    goteAccess: {
        type:Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    }
}, {timestamps: true});

GameSchema.pre("save", function (next) {
    if (this.isNew) {   
        this.senteAccess = mongoose.Types.ObjectId();
        this.goteAccess = mongoose.Types.ObjectId();
        return next();
    } else {
        return next();
    }
});

const Game = mongoose.model("Game", GameSchema);

module.exports = Game;