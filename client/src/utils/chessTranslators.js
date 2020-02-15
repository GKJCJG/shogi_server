const symbolDictionary = {
    "p": { "sente": "♙", "gote": "♟" },
    "n": { "sente": "♘", "gote": "♞" },
    "b": { "sente": "♗", "gote": "♝" },
    "r": { "sente": "♖", "gote": "♜" },
    "q": { "sente": "♕", "gote": "♛" },
    "k": { "sente": "♔", "gote": "♚" }
}

const reverseDictionary = {
    "♙": "p",
    "♘": "n",
    "♗": "b",
    "♖": "r",
    "♕": "q",
    "♔": "k",
    "♟": "P",
    "♞": "N",
    "♝": "B",
    "♜": "R",
    "♛": "Q",
    "♚": "K"
}

class ChessFEN {
    constructor (representation) {
        if (representation instanceof String || typeof representation === "string") {
            this.FENString = representation;
            this.stringToPosition();
        } else {
            this.position = representation;
            this.positionToString();
        }
    }

    stringToPosition () {
        this.position = {};
        let rank = 8, file = 1;
        for (let i = 0; i < this.FENString.length; i++) {
            const currentCharacter = this.FENString[i];
            if (currentCharacter === "/") {
                for (let j = file; j < 9; j++) {
                    this.position["" + j + rank] = "";
                }
                rank--;
                file = 1;
            } else if (isNaN(currentCharacter)) {
                const side = /[A-Z]/.test(currentCharacter) ? "gote" : "sente";
                this.position["" + file + rank] = symbolDictionary[currentCharacter.toLowerCase()][side];
                file ++;
            } else {
                const limit = file + parseInt(currentCharacter);
                for (let j = file; j < limit; j++) {
                    this.position["" + file + rank] = "";
                    file ++;
                }
            }
        }
        for (let i = rank; i > 0; i--) {
            for (let j = file; j < 9; j++) {
                this.position["" + j + i] = "";
            }
            file = 1;
        }
    }

    positionToString() {
        this.FENString = "";
        for (let i = 8; i > 0; i--) {
            let currentBlanks = 0;
            for (let j = 1; j < 9; j++) {
                const currentSquare = this.position["" + j + i];
                if (currentSquare === "") {
                    currentBlanks ++;
                } else {
                    if (currentBlanks) this.FENString += currentBlanks;
                    this.FENString += reverseDictionary[currentSquare];
                    currentBlanks = 0;
                }
            }
            if (currentBlanks) this.FENString += currentBlanks;
            if (i !== 1) this.FENString += "/";
        }
    }
}

export {ChessFEN};