const mongoose = require("mongoose");
const Game = require("../models/game");

const hidePasswords = (users) => {
  users.forEach(e => {
    e.password="hidden!";
    return e;
  })
  return users;
}

mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://localhost/shogiserver"
);

Game.find({})
.select("-senteContact -goteContact -senteNick -goteNick")
.then(dbGames => {
  console.log(dbGames);
});