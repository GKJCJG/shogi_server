import pieces from "./pieces";
import PieceStand from "./pieceStand";
import {Square} from "./boardSquare";
import {ShogiPosition} from "./shogiPosition";

function otherSide(side) {
    return side === "sente" ? "gote" : "sente";
}

class Board {
    constructor (handicap) {
        this.position = {};
        for (let i = 1; i<10; i++) {
            for (let j=1; j<10; j++) {
                this.position[""+i+j] = new Square(i, j, this.checkOwner.bind(this), this.makeMove.bind(this));
            }
        }

        this.position.senteHand = new PieceStand("sente", this.niFu.bind(this), this.checkOwner.bind(this));
        this.position.goteHand = new PieceStand("gote", this.niFu.bind(this), this.checkOwner.bind(this));
        this.handicap = handicap
        this.turn = handicap ? "gote" : "sente";
        this.lastMove = {origin: null, target: null, piece: null};
        this.moves = [];
    }

    initialize(clearFirst=false) {
        if (clearFirst) {
            for (let i = 1; i<10; i++) {
                for (let j=1; j<10; j++) {
                    this.position[""+i+j].removeOccupant();
                }
            }
            this.position.goteHand.clear();
            this.position.senteHand.clear();
        }

        const arrayAdd = (array, Piece) => {
            array.forEach((e, i) => {
                this.position[e].addOccupant(new Piece(), i < array.length/2 ? "sente" : "gote");
            }) 
        }

        arrayAdd([99, 19, 11, 91], pieces.Lance);
        arrayAdd([29, 89, 21, 81], pieces.Knight);
        arrayAdd([39, 79, 31, 71], pieces.Silver);
        arrayAdd([49, 69, 41, 61], pieces.Gold);
        arrayAdd([59], pieces.King);
        this.position[51].addOccupant(new pieces.GKing(), "gote");
        arrayAdd([88, 22], pieces.Bishop);
        arrayAdd([28, 82], pieces.Rook);
        const pawnLoc = [];
        for (let i=1; i<10; i++) {
            pawnLoc.unshift(i+"7");
            pawnLoc.push(i+"3");
        };
        arrayAdd(pawnLoc, pieces.Pawn);

        switch (this.handicap) {
            case "rook-lance":
                this.position["82"].removeOccupant();
                //fallsthrough
            case "lance":
                this.position["11"].removeOccupant();
                break;
            case "bishop":
                this.position["22"].removeOccupant();
                break;
            // the following cases build on each other
            case "ten-piece":
                this.position["61"].removeOccupant();
                //fallsthrough
            case "nine-piece":
                this.position["41"].removeOccupant();
                //fallsthrough
            case "eight-piece":
                this.position["71"].removeOccupant();
                //fallsthrough
            case "seven-piece":
                this.position["31"].removeOccupant();
                //fallsthrough
            case "six-piece":
                this.position["81"].removeOccupant();
                //fallsthrough
            case "five-piece":
                this.position["21"].removeOccupant();
                //fallsthrough
            case "four-piece":
                this.position["11"].removeOccupant();
                //fallsthrough
            case "three-piece":
                this.position["91"].removeOccupant();
                //fallsthrough
            case "two-piece":
                this.position["22"].removeOccupant();
                //fallsthrough
            case "rook":
                this.position["82"].removeOccupant();
                break;
            default: break;
        }
    }

    checkOwner (coordinate) {
        if(this.position[coordinate].occupant) return {owner: this.position[coordinate].owner, occupant: this.position[coordinate].occupant};
        return false;
    }

    // Options include: whether the piece certainly promoted, and whether the game should record this move as a move.
    makeMove (moveInfo, options) {
        const {origin, target, piece} = moveInfo;
        const doesPromote = options.doesPromote || false;

        const recordMove = () => {
            this.lastMove = {};
            if (origin.search("Hand") !== -1) {
                this.lastMove = {type:"drop", origin, target, piece};
            } else if (this.position[target].occupant) {
                const originOccupant = this.position[origin].occupant;
                const targetOccupant = this.position[target].occupant;
                const capturedPiece = targetOccupant instanceof pieces.Promoted ? new targetOccupant.stand().name : targetOccupant.name;

                this.lastMove = {type: "capture", origin, originOccupant, target, targetOccupant, piece: capturedPiece};
            } else {
                const originOccupant = this.position[origin].occupant;
                const targetOccupant = this.position[target].occupant;
                
                this.lastMove = {type: "move", origin, originOccupant, target, targetOccupant};
            }
        }

        const enactMove = () => {

            const {occupant, owner} = this.position[origin].removeOccupant(piece || doesPromote);
            this.position[target].addOccupant(occupant, owner, doesPromote);

        }

        recordMove();
        enactMove();
    }

    // this method is mainly for testing for checks. The deleteMove() method will delete the last move and replay from the start.
    undoMove(turn) {
        const {type, origin, target, piece, targetOccupant, originOccupant} = this.lastMove;

        if (type === "drop") {
            const revertedPiece = this.position[target].removeOccupant().occupant;
            this.position[origin].addOccupant(revertedPiece);
        } else if (type === "move") {
            this.position[target].removeOccupant();
            this.position[origin].addOccupant(originOccupant, turn);
        } else if (type === "capture") {
            this.position[target].removeOccupant();
            this.position[origin].addOccupant(originOccupant, turn);
            this.position[target].addOccupant(targetOccupant, otherSide(turn));
            this.position[turn+"Hand"].removeOccupant(piece);
        }
    }

    niFu (owner, file) {
        for (let i = 1; i < 10; i++) {
            if (this.position[file+i].owner===owner && this.position[file+i].occupant instanceof pieces.Pawn) return true;
        }
        return false;
    }

    readOneMove (string) {
        let origin, target, piece;
        let doesPromote = false;

        const processString = () => {
            if (string.split("-").length === 2) {
                if (string[string.length-1] === "+") {
                    doesPromote = true;
                    string = string.substring(0, string.length-1);
                }
                [origin, target] = string.split("-");
            } else {
                [piece, target] = string.split("*");
                origin = this.turn + "Hand";
            }
        }

        processString();

        this.moves.push(string);
        this.makeMove({origin, target, piece}, {doesPromote});
        this.turn = otherSide(this.turn);
    }

    readMoves (array) {
        array.forEach(this.readOneMove.bind(this));
    }

    render () {
        let positionAnalyser = new ShogiPosition(this.position);
        const legalMoves = positionAnalyser.getMoveList();
        let currentPosition = {};

        const playerMoves = legalMoves[this.turn+"Moves"];
        const playerDrops = legalMoves[this.turn+"Drops"];
        const opponentMoves = legalMoves[otherSide(this.turn) + "Moves"];
        const allMoves = playerMoves.concat(opponentMoves);

        if (!(playerMoves.length || playerDrops.length)) {
            currentPosition.checkMate = true;
            currentPosition.winner = otherSide(this.turn);
        }

        currentPosition.inCheck = positionAnalyser[this.turn+"InCheck"];

        for(let i = 1; i < 10; i++) {
            for (let j = 1; j < 10; j++) {
                currentPosition[""+i+j] = this.position[""+i+j].render();
                currentPosition[""+i+j].moves = allMoves.filter(e => e.origin === ""+i+j).map(e => e.target);
            }
        }
        currentPosition.senteHand = this.position.senteHand.render();
        currentPosition.goteHand = this.position.goteHand.render();



        currentPosition.senteDrops = legalMoves.senteDrops;
        currentPosition.goteDrops = legalMoves.goteDrops;
        let lastMove = this.moves[this.moves.length-1] || null;
        lastMove = lastMove ? lastMove.split(lastMove.search("-") === -1 ? "*" : "-")[1] : null;
        currentPosition.lastMove = lastMove;

        return currentPosition;
    }
}

export default Board;