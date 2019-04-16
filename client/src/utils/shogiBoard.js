import pieces from "./pieces";
import PieceStand from "./pieceStand";
import {Square} from "./boardSquare";
import {otherSide} from "./smallClasses";
import {MoveFinder} from "./moveFinder";

class Board {
    constructor () {
        for (let i = 1; i<10; i++) {
            for (let j=1; j<10; j++) {
                this[""+i+j] = new Square(i, j, this.checkOwner.bind(this));
            }
        }

        this.senteHand = new PieceStand("sente");
        this.goteHand = new PieceStand("gote");

        this.turn = "sente";
    }

    initialize(handicap) {
        handicap = handicap || this.handicap;
        this.handicap = handicap;
        if (handicap) this.turn = "gote";

        this.clear();
        this.populate();
        this.removeHandicapPieces();
    }

    clear() {
        for (let i = 1; i<10; i++) {
            for (let j=1; j<10; j++) {
                this[""+i+j].removeOccupant();
            }
        }
        this.goteHand.clear();
        this.senteHand.clear();
    }

    populate() {
        this.addArrayOfPieces([99, 19, 11, 91], pieces.Lance);
        this.addArrayOfPieces([29, 89, 21, 81], pieces.Knight);
        this.addArrayOfPieces([39, 79, 31, 71], pieces.Silver);
        this.addArrayOfPieces([49, 69, 41, 61], pieces.Gold);
        this.addArrayOfPieces([59], pieces.King);
        this[51].addOccupant(new pieces.GKing(), "gote");
        this.addArrayOfPieces([88, 22], pieces.Bishop);
        this.addArrayOfPieces([28, 82], pieces.Rook);
        const pawnLoc = [];
        for (let i=1; i<10; i++) {
            pawnLoc.push(i+"7");
        };
        for (let i=1; i<10; i++) {
            pawnLoc.push(i+"3");
        };
        this.addArrayOfPieces(pawnLoc, pieces.Pawn);
    }

    addArrayOfPieces = (array, Piece) => {
        array.forEach((e, i) => {
            this[e].addOccupant(new Piece(), i < array.length/2 ? "sente" : "gote");
        }) 
    }

    removeHandicapPieces() {
        switch (this.handicap) {
            case "rook-lance":
                this["82"].removeOccupant();
                //fallsthrough
            case "lance":
                this["11"].removeOccupant();
                break;
            case "bishop":
                this["22"].removeOccupant();
                break;
            // the following cases build on each other
            case "ten-piece":
                this["61"].removeOccupant();
                //fallsthrough
            case "nine-piece":
                this["41"].removeOccupant();
                //fallsthrough
            case "eight-piece":
                this["71"].removeOccupant();
                //fallsthrough
            case "seven-piece":
                this["31"].removeOccupant();
                //fallsthrough
            case "six-piece":
                this["81"].removeOccupant();
                //fallsthrough
            case "five-piece":
                this["21"].removeOccupant();
                //fallsthrough
            case "four-piece":
                this["11"].removeOccupant();
                //fallsthrough
            case "three-piece":
                this["91"].removeOccupant();
                //fallsthrough
            case "two-piece":
                this["22"].removeOccupant();
                //fallsthrough
            case "rook":
                this["82"].removeOccupant();
                break;
            default: break;
        }
    }

    checkOwner (coordinate) {
        if(this[coordinate].occupant) return {owner: this[coordinate].owner, occupant: this[coordinate].occupant};
        return false;
    }

    render () {
        let moveFinder = new MoveFinder(this);
        const legalMoves = moveFinder.getMoveList();
        let currentPosition = {};

        const playerMoves = legalMoves[this.turn+"Moves"];
        const playerDrops = legalMoves[this.turn+"Drops"];
        const opponentMoves = legalMoves[otherSide(this.turn) + "Moves"];
        const allMoves = playerMoves.concat(opponentMoves);

        if (!(playerMoves.length || playerDrops.length)) {
            currentPosition.checkMate = true;
            currentPosition.winner = otherSide(this.turn);
        }

        currentPosition.inCheck = moveFinder[this.turn+"InCheck"];

        for(let i = 1; i < 10; i++) {
            for (let j = 1; j < 10; j++) {
                currentPosition[""+i+j] = this[""+i+j].render();
                currentPosition[""+i+j].moves = allMoves.filter(e => e.origin === ""+i+j).map(e => e.target);
            }
        }
        currentPosition.senteHand = this.senteHand.render();
        currentPosition.goteHand = this.goteHand.render();

        currentPosition.senteDrops = legalMoves.senteDrops;
        currentPosition.goteDrops = legalMoves.goteDrops;

        return currentPosition;
    }
}

export default Board;