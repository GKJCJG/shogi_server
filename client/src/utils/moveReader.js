import {otherSide} from "./smallClasses";

class MoveReader {

    constructor(position, moves = []) {
        this.position = position;
        this.moves = moves;
        this.gamePosition = 0;
        this.readMoves(moves);
    }

    makeMove(moveInfo) {
        const { origin, target, piece, doesPromote} = moveInfo;
        const turn = this.position.turn;

        if (this.position[target].occupant !== null) {
            const capturedPiece = this.position[target].removeOccupant();
            this.position[turn + "Hand"].addOccupant(capturedPiece);
        }
        
        let movedPiece;
        if (piece) {
            movedPiece = this.position[turn + "Hand"].occupants[piece].pop();
        } else {
            movedPiece = this.position[origin].removeOccupant();
        }
        if (doesPromote) movedPiece = new movedPiece.promotion();

        this.position[target].addOccupant(movedPiece, turn);
        this.position.turn = otherSide(turn);
    }

    undoMove() {
        if (this.gamePosition === 0) return;
        this.gamePosition--;
        this.readMoveSubset();
    }

    redoMove() {
        if (this.gamePosition === this.moves.length) return;
        this.gamePosition++;
        this.readMoveSubset();
    }

    readMoveSubset() {
        this.position.initialize();
        this.readMoves(this.moves.slice(0, this.gamePosition - this.moves.length));
    }

    readMoves(array) {
        array.forEach(this.readOneMove.bind(this));
    }

    readOneMove(string) {
        const {origin, target, piece, doesPromote} = this.processString(string);

        this.makeMove({ origin, target, piece, doesPromote });
        this.turn = otherSide(this.turn);
        this.gamePosition++;
    }

    processString (string) {
        let doesPromote = false, origin, target, piece;
        if (string.search("-") !== -1) {
            if (string[string.length - 1] === "+") {
                doesPromote = true;
                string = string.substring(0, string.length - 1);
            }
            [origin, target] = string.split("-");
        } else {
            [piece, target] = string.split("*");
            origin = this.turn + "Hand";
        }
        return {origin, target, piece, doesPromote};
    }

    getNewPosition() {
        return this.position;
    }
}

export { MoveReader };