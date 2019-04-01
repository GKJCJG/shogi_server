import pieces from "./pieces";

class Square {
    constructor (i, j, checkSpace, makeMove) {
        Object.defineProperty(this, "coordinate", {
            configurable: true,
            writable: false,
            value: [i, j]
        });

        this.checkSpace = checkSpace;
        this.makeMove = makeMove;
        this.owner = null;
        this.occupant = null;
    }
      
    capture() {
        const origin = this.coordinate.join("");
        const target = this.owner === "sente" ? "goteHand" : "senteHand";
        this.makeMove({origin, target}, {shouldRecord: false});
    }

    addOccupant(piece, owner, doesPromote) {
        if (this.occupant) {
            this.capture();
        }

        this.occupant = piece;
        this.owner = owner;

        if (doesPromote && this.occupant instanceof pieces.Promotable) {
            this.occupant = new this.occupant.promotion()
        }
    }

    removeOccupant(doesPromote) {
        if (doesPromote) {
            this.occupant = new this.occupant.promotion()
        }

        const previousTenant = {occupant: this.occupant, owner: this.owner};

        this.occupant = null;
        this.owner = null;
        return previousTenant;
    }

    listMoves() {
        const handleRange = (piece) => {
            const oneDirection = (forward, sideways, multiplier) => {
                let moves = [];
                // loop terminates when the piece would go off the board.
                for (let i = 1; this.coordinate[1] + i*multiplier*forward > 0 
                    && this.coordinate[1] + i*multiplier*forward < 10
                    && this.coordinate[0] + i*multiplier*sideways > 0
                    && this.coordinate[0] + i*multiplier*sideways < 10; i++) {
                        //identify the target square and see who's there.
                        let xCoord = this.coordinate[0]+i*multiplier*sideways;
                        let yCoord = this.coordinate[1]+i*multiplier*forward;
                        let targetSquare = ""+xCoord+yCoord
                        let targetOccupant = this.checkSpace(targetSquare);
                        // if you hit your own piece, stop; if opponent's, capture and stop; if none, keep moving.
                        if (targetOccupant===this.owner) {
                            break;
                        } else if (targetOccupant) {
                            moves.push([xCoord, yCoord]);
                            break;
                        } else {
                            moves.push([xCoord, yCoord]);
                        }
                    }
                return moves;
            }
            let rangedMoves = [];
            let multiplier = this.owner === "sente" ? -1 : 1;
            switch (piece) {
                case "rook":
                    rangedMoves = rangedMoves.concat(oneDirection(0, 1, multiplier));
                    rangedMoves = rangedMoves.concat(oneDirection(0, -1, multiplier));
                    rangedMoves = rangedMoves.concat(oneDirection(-1, 0, multiplier));
                    // fallsthrough
                case "lance":
                    rangedMoves = rangedMoves.concat(oneDirection(1, 0, multiplier));
                    break;
                case "bishop":
                    rangedMoves = rangedMoves.concat(oneDirection(1, 1, multiplier));
                    rangedMoves = rangedMoves.concat(oneDirection(-1, 1, multiplier));
                    rangedMoves = rangedMoves.concat(oneDirection(1, -1, multiplier));
                    rangedMoves = rangedMoves.concat(oneDirection(-1, -1, multiplier));
                    break;
                default: break;
            }
            
            return rangedMoves;            
        };

        let moveList = [];
        this.occupant.moves.forEach(e => {
            switch (e) {
                case "lance":
                // falls through
                case "rook":
                // falls through
                case "bishop":
                    moveList = moveList.concat(handleRange(e));
                    break;
                default:
                    const move = e.map(coordinate => coordinate*(this.owner === "sente" ? -1 : 1));
                    moveList.push([this.coordinate[0]+move[0], this.coordinate[1]+move[1]])
                    // filter the moves to remove any that are off the board or that would 'capture' a piece of the same side. Not necessary for ranged pieces as their logic handes it.
                    moveList = moveList.filter(e => (e[0] < 10
                        && e[1] < 10 
                        && e[0] > 0 
                        && e[1] > 0 
                        && !(this.checkSpace(e.join(""))===this.owner)))
            }
        });

        // then map it into the text format for a move and return.
        return moveList.map(target => {return {origin: this.coordinate.join(""), target: target.join("")}});
        
    }

    render () {
        return {
            class: [this.owner],
            occupant: this.occupant ? this.occupant.symbol : ""
        }
    }
}

export default Square;