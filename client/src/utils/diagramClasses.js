import { letterDictionary, symbolDictionary, nameDictionary } from "./dictionaries";

/* eslint-disable no-use-before-define */

class FenString extends String {

    translateToObject() {
        const rowPartial = this.translateRows();
        const handPartials = this.translateHands();

        return Object.assign(rowPartial, handPartials);
    }

    translateRows() {
        let rows = {}
        for (let i = 9; i > 0; i--) {
            const singleRow = this.translateRow(i);
            Object.assign(rows, singleRow);
        }
        return rows;
    }

    translateRow(rowNumber) {
        let output = {}, currentFile = 9, rowString = this.split("/")[9 - rowNumber];
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

        function handleSymbol(letter) {

            let squareClass = /[A-Z]/.test(letter) ? ["gote"] : ["sente"];
            let occupant = letterDictionary[letter.toLowerCase()].symbol;

            output["" + currentFile + rowNumber] = { class: squareClass, occupant, symbol: letter };

        }

        function handleNumber(emptySquareCount) {
            for (let i = 0; i < emptySquareCount; i++) {
                let currentSquare = "" + (currentFile - i) + rowNumber;
                output[currentSquare] = { class: [null], occupant: null, symbol: null };
            }
        }
    }

    translateHands() {
        const senteHand = Object.assign(this.translateHand(this.split("/")[9] || "0000000"), { class: "sente" });
        const goteHand = Object.assign(this.translateHand(this.split("/")[10] || "0000000"), { class: "gote" });
        return { senteHand, goteHand };
    }

    translateHand(handString) {
        let handOccupants = [];
        const pieceOrder = ["歩", "香", "桂", "銀", "金", "角", "飛"];
        for (let i = 0; i < pieceOrder.length; i++) {
            handOccupants.push({ symbol: pieceOrder[i], number: parseInt(handString[i]) || 0, name: symbolDictionary[pieceOrder[i]].name });
        }
        return { occupants: handOccupants };
    }
}

class DiagramPosition {
    constructor(object) {
        Object.assign(this, object);
    }

    translateToString() {
        let rawString = "";
        rawString += this.translateSquares();
        rawString += this.translateHands();
        return rawString;
    }

    translateToPlainObject() {
        let output = {};
        for (let i = 1; i < 10; i++) {
            for (let j = 1; j < 10; j++) {
                output[`${i}${j}`] = this[`${i}${j}`];
            }
        }
        output.senteHand = this.senteHand;
        output.goteHand = this.goteHand;
        return output;
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
        const currentHand = this[whichHand + "Hand"].occupants;
        for (let i = 0; i < currentHand.length; i++) {
            output += currentHand[i].number;
        }
        return output;
    }

    addPiece(location, piece, owner) {
        const boardPiece = this.getPiece(piece);
        if (isNaN(location)) {
            this.addPieceToHand(location, boardPiece);
        } else {
            this.addPieceToBoard(location, boardPiece, owner);
        }
    }

    getPiece(piece) {
        const pieceRepresentation = piece.trim().toLowerCase();
        if (pieceRepresentation in letterDictionary) {
            return {
                symbol: pieceRepresentation,
                occupant: letterDictionary[pieceRepresentation].symbol,
                name: letterDictionary[pieceRepresentation].name
            };
        } else if (pieceRepresentation in symbolDictionary) {
            return {
                symbol: symbolDictionary[pieceRepresentation].letter,
                occupant: pieceRepresentation,
                name: symbolDictionary[pieceRepresentation].name
            };
        } else if (pieceRepresentation in nameDictionary) {
            return {
                symbol: nameDictionary[pieceRepresentation].letter,
                occupant: nameDictionary[pieceRepresentation].symbol,
                name: pieceRepresentation
            }
        }
        throw new Error(`Unable to find piece matcthing ${pieceRepresentation}`);
    }

    addPieceToHand(location, piece) {
        const pieceToIncrement = this.findHandOccupant(location, piece);
        pieceToIncrement && pieceToIncrement.number++;
    }

    findHandOccupant(location, piece) {
        return this[location].occupants.find(occupant => occupant.name === piece.name);
    }

    addPieceToBoard(location, piece, owner) {
        const { occupant, symbol } = piece;
        this[location] = { occupant, class: [owner], symbol };
    }

    removePiece(location, piece) {
        if (isNaN(location)) {
            const boardPiece = this.getPiece(piece);
            this.removePieceFromHand(location, boardPiece);
        } else {
            this[location] = { occupant: null, class: [null], symbol: null };
        }
    }

    removePieceFromHand(location, piece) {
        const pieceToIncrement = this.findHandOccupant(location, piece);
        if (pieceToIncrement) {
            pieceToIncrement.number = pieceToIncrement.number && pieceToIncrement.number - 1;
        }
    }
}

export { FenString, DiagramPosition };

/* eslint-enable no-use-before-define */