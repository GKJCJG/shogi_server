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
.then(dbGames => {
  console.log(dbGames);
});

Game.findOne({$or: 
  [{senteAccess: "5c6dd595a4e76c002a4c5b03"}, {goteAccess: "5c6dd595a4e76c002a4c5b03"}]
})
.then(dbGame => {
  moves = dbGame.moves;
  last = dbGame.moves.length-1;
  if (dbGame.moves[last] === dbGame.moves[last-1]) {
    dbGame.moves.pop();
    dbGame.save()
    .then(dbGame => console.log(dbGame));
  }
});