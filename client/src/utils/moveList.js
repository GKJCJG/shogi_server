import pieces from "./pieces";

class MoveList {
    constructor (parent, moves, drops, turn) {

    }

    filterIllegalMoves () {
        const kingThreats = this.findKingThreats(turn)
        const kingSquare = this.findKing(turn);
        if (options.mustAvoidCheck && this.isInCheck(turn)) {
            moveList.moves = moveList
                .filter(move => !(this[move[1]].occupant instanceof pieces.King))
                .filter(move => kingThreats.allRelevant.includes(move[1]) || move[0] === kingSquare)
                .filter(move => this.noAutoCheck(turn, move, []));
        } else if (options.mustAvoidCheck && kingThreats.threats.length) {
            moveList = moveList
                .filter(move => this.noAutoCheck(turn, move, kingThreats.interposita))
        }
    }

    filterIfChecked (move) {
        return 
    }

    filterIfNotCheck (move) {

    }


}