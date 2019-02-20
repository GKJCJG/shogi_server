class Piece {
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
    moves = [[0, 1]];
    symbol = "歩";
    letter = "p";
    forced = 9;
    promotion = Tokin;
};

class Tokin extends Promoted {
    symbol = "と";
    letter = "t"
    stand = Pawn;
};

class Lance extends Promotable {
    moves = ["lance"];
    symbol = "香";
    letter = "l";
    promotion = PLance;
    forced = 9;
};

class PLance extends Promoted {
    symbol = "杏";
    letter = "x";
    stand = Lance;
};

class Knight extends Promotable {
    moves = [[1, 2], [-1, 2]];
    symbol = "桂";
    letter = "n";
    promotion = PKnight;
    forced = 8
};

class PKnight extends Promoted {
    symbol = "圭";
    letter = "h";
    stand = Knight;
};

class Silver extends Promotable {
    moves = [[0, 1], [1, 1], [1, -1], [-1, -1], [-1, 1]];
    symbol = "銀";
    letter = "s";
    promotion = PSilver;
};

class PSilver extends Promoted {
    symbol = "全";
    letter = "q";
    stand = Silver;
};

class Gold extends Piece {
    moves = [[0, 1], [1, 1], [1, 0], [0, -1], [-1, 0], [-1, 1]];
    symbol = "金"
    letter = "g"
};

class Bishop extends Promotable {
    moves = ["bishop"];
    symbol = "角";
    letter = "b";
    promotion = Horse;
};

class Horse extends Promoted {
    moves = ["bishop", [1, 0], [0, 1], [-1, 0], [0, -1]];
    symbol = "馬";
    letter = "m";
    stand = Bishop;
};

class Rook extends Promotable {
    moves = ["rook"];
    symbol = "飛";
    letter = "r";
    promotion = Dragon;
};

class Dragon extends Promoted {
    moves = ["rook", [1, 1], [1, -1], [-1, -1], [-1, 1]];
    symbol = "竜";
    letter = "d";
    stand = Rook;
};

class King extends Piece {
    moves = [[0, 1], [1, 1], [1, 0], [0, -1], [-1, 0], [-1, 1], [-1, -1], [1, -1]];
    symbol = "玉";
    letter = "k";
};

class GKing extends King {
    symbol = "王";
};

export default {Pawn, Tokin, Lance, PLance, Knight, PKnight, Silver, PSilver, Gold, Bishop, Horse, Rook, Dragon, King, GKing, Promotable, Promoted};