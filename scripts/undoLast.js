const mongoose = require("mongoose");
const Game = require("../models/game");

console.log(process.argv);

mongoose.connect(
  process.env.MONGODB_URI ||
  "mongodb://localhost/shogiserver"
);

Game.findOne({$or: [{senteAccess: process.argv[2]}, {goteAccess: process.argv[2]}]})
.then(dbGame => {
  dbGame.moves.pop();
  dbGame.save()
  .then(dbGame => console.log("Undid your move!"));
});