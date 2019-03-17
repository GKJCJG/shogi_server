const symbolDictionary = {
    p: "歩",
    t:　"と",
    l:　"香",
    x: "杏",
    n: "桂",
    h: "圭",
    s: "銀",
    q: "全",
    g: "金",
    b: "角",
    m: "馬",
    r: "飛",
    d: "竜",
    k: "玉"
};

/* eslint-disable no-use-before-define */

class FenString extends String {

    translateToObject() {
        const rowPartial = this.translateRows();
        const handPartials = this.translateHands();

        return Object.assign(rowPartial, handPartials);
    }

    translateRows() {
        let rows = {}
        for (let i=9; i>0; i--) {
            const singleRow = this.translateRow(i);
            Object.assign(rows, singleRow);
        }
        return rows;
    }

    translateRow(rowNumber) {
        let output = {}, currentFile = 9, rowString = this.split("/")[9-rowNumber];
        rowNumber = 9 - rowNumber + 1;
        for (let i = 0; i < rowString.length; i++) {
            if (currentFile < 1) break;
            if (isNaN(rowString[i])) {
                handleSymbol(rowString[i]);
                currentFile--;
            } else {
                handleNumber(parseInt(rowString[i]));
                currentFile -= rowString[i];
            }
        }

        if (currentFile > 0) handleNumber(currentFile);
        return output;
        
        function handleSymbol(symbol) {

            let squareClass = /[A-Z]/.test(symbol) ? ["gote"] : ["sente"];
            let occupant = symbolDictionary[symbol.toLowerCase()];

            output["" + currentFile + rowNumber] = {class: squareClass, occupant};
                        
        }
    
        function handleNumber(emptySquareCount) {
            for (let i=0; i<emptySquareCount; i++) {
                let currentSquare = "" + (currentFile-i) + rowNumber;
                output[currentSquare] = {class: [null], occupant: null};
            }
        }
    }

    translateHands() {
        const senteHand = Object.assign(this.translateHand(this.split("/")[9] || "0000000"), {class: "sente"});
        const goteHand = Object.assign(this.translateHand(this.split("/")[10] || "0000000"), {class: "gote"});
        return {senteHand, goteHand};
    }

    translateHand(handString) {
        let handOccupants = [];
        const pieceOrder = ["歩", "香", "桂", "銀", "金", "角", "飛"];
        for (let i = 0; i < pieceOrder.length; i++) {
            handOccupants.push({symbol: pieceOrder[i], number: parseInt(handString[i]) || 0});
        }
        return {occupants: handOccupants};
    }
}

class ShogiPosition {
    constructor(object) {
        Object.assign(this, object);
    }

    translateToString () {
        let rawString = "";
        rawString += this.translateSquares();
        rawString += this.translateHands();
        return rawString;
    }

    translateSquares() {
        let output = "", blankSquares = 0;
        const translateSquare = translateSquareUnbound.bind(this);
        for (let i = 1; i < 10; i++) {
            for (let j = 9; j > 0; j--) {
                output += translateSquare([j, i]);
            }
        }
        return output;

        function translateSquareUnbound(coordinate) {
            const [file, rank] = coordinate,
                currentSquare = this["" + file + rank],
                currentBlanks = blankSquares || "";

            let output = ""
            const symbol = currentSquare.occupant === null ? "" : (currentSquare.class[0] === "gote" ? currentSquare.symbol.toUpperCase() : currentSquare.symbol);
            if (symbol) {
                blankSquares = 0;
                output += currentBlanks + symbol;
            } else {
                blankSquares++;
            }

            if (file === 1) {
                if (output) {
                    output += "/";
                } else {
                    output += blankSquares + "/"
                    blankSquares = 0;
                }
            }
            return output;
        }
    }

    translateHands() {
        let output = "";
        output += this.translateHand("sente") + "/";
        output += this.translateHand("gote");
        return output;
    }

    translateHand(whichHand) {
        let output = "";
        const currentHand = this[whichHand+"Hand"].occupants;
        for (let i = 0; i < currentHand.length; i++) {
            output += currentHand[i].number;
        }
        return output;
    }
}

export {FenString, ShogiPosition};

/* eslint-enable no-use-before-define */