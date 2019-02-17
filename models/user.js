const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;
    
const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    games: [{
        type: Schema.Types.ObjectId,
        ref: "Game"
    }],
});
 
UserSchema.pre("save", function (next) {
    var user = this;
    if (this.isModified("password") || this.isNew) {
        bcrypt.genSalt(12, (err, salt) => {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, (err, hash) => {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compareSync(passw, this.password);
};

module.exports = mongoose.model("User", UserSchema)