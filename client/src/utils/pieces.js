/* eslint-disable no-use-before-define */
class Piece {
    name;
    moves;
    symbol;
    letter;

    capture() {
        return(this);
    }
};

class Promotable extends Piece {
    promotion;
    forced = 0;

    promote () {
        return new this.promotion();
    }
};

class Promoted extends Piece {
    moves = [[0, 1], [1, 1], [1, 0], [0, -1], [-1, 0], [-1, 1]];
    stand;

    capture() {
        return new this.stand();
    }
};

class Pawn extends Promotable {
    name = "pawn";
    moves = [[0, 1]];
    symbol = "歩";
    letter = "p";
    forced = 9;
    promotion = Tokin;
};

class Tokin extends Promoted {
    name = "tokin";
    symbol = "と";
    letter = "t"
    stand = Pawn;
};

class Lance extends Promotable {
    name = "lance";
    moves = ["lance"];
    symbol = "香";
    letter = "l";
    promotion = PLance;
    forced = 9;
};

class PLance extends Promoted {
    name = "plance";
    symbol = "杏";
    letter = "x";
    stand = Lance;
};

class Knight extends Promotable {
    name = "knight";
    moves = [[1, 2], [-1, 2]];
    symbol = "桂";
    letter = "n";
    promotion = PKnight;
    forced = 8
};

class PKnight extends Promoted {
    name = "pknight";
    symbol = "圭";
    letter = "h";
    stand = Knight;
};

class Silver extends Promotable {
    name = "silver";
    moves = [[0, 1], [1, 1], [1, -1], [-1, -1], [-1, 1]];
    symbol = "銀";
    letter = "s";
    promotion = PSilver;
};

class PSilver extends Promoted {
    name = "psilver"
    symbol = "全";
    letter = "q";
    stand = Silver;
};

class Gold extends Piece {
    name = "gold";
    moves = [[0, 1], [1, 1], [1, 0], [0, -1], [-1, 0], [-1, 1]];
    symbol = "金"
    letter = "g"
};

class Bishop extends Promotable {
    name = "bishop";
    moves = ["bishop"];
    symbol = "角";
    letter = "b";
    promotion = Horse;
};

class Horse extends Promoted {
    name = "horse";
    moves = ["bishop", [1, 0], [0, 1], [-1, 0], [0, -1]];
    symbol = "馬";
    letter = "m";
    stand = Bishop;
};

class Rook extends Promotable {
    name = "rook";
    moves = ["rook"];
    symbol = "飛";
    letter = "r";
    promotion = Dragon;
};

class Dragon extends Promoted {
    name = "dragon";
    moves = ["rook", [1, 1], [1, -1], [-1, -1], [-1, 1]];
    symbol = "竜";
    letter = "d";
    stand = Rook;
};

class King extends Piece {
    name = "king";
    moves = [[0, 1], [1, 1], [1, 0], [0, -1], [-1, 0], [-1, 1], [-1, -1], [1, -1]];
    symbol = "玉";
    letter = "k";
};

class GKing extends King {
    symbol = "王";
};

export default {Pawn, Tokin, Lance, PLance, Knight, PKnight, Silver, PSilver, Gold, Bishop, Horse, Rook, Dragon, King, GKing, Promotable, Promoted};
/* eslint-enable no-use-before-define */