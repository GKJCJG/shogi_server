import pieces from "./pieces";

class Vector {
    constructor (origin, target) {
        this.vector = [target[0]-origin[0], target[1]-origin[1]];
        this.unitVector = this.vector.map(coordinate => {
            if (coordinate !== 0) return coordinate / Math.abs(coordinate);
            return 0;
        });
        this.magnitude = this.vector[1] !== 0 ? Math.abs(this.vector[1]) : Math.abs(this.vector[0]);
    }
}

class Square {
    constructor (i, j, checkOwner, makeMove) {
        Object.defineProperty(this, "coordinate", {
            configurable: true,
            writable: false,
            value: [i, j]
        });

        this.checkOwner = checkOwner;
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
        let moveList = [];
        this.occupant.moves.forEach(moveVector => {
            const move = moveVector.map(coordinate => coordinate*(this.owner === "sente" ? -1 : 1));
            moveList.push([this.coordinate[0]+move[0], this.coordinate[1]+move[1]])
        });

        moveList = moveList.filter(this.isOnBoard).filter(this.doesntCaptureSelf);

        if (this.isRanged(this.occupant)) {
            moveList = moveList.filter(this.noMovingThrough);
        }

        // then map it into the text format for a move and return.
        return moveList.map(target => {return {origin: this.coordinate.join(""), target: target.join("")}});
    }

    isOnBoard(square) {
        return square[0] < 10 && square[1] < 10 && square[0] > 0 && square[1] > 0;
    }

    noIllegalCaptures(square) {
        const targetOccupant = this.checkOwner(square.join(""));
        return !((targetOccupant.owner === this.owner) || targetOccupant.occupant instanceof pieces.King);
    }

    isRanged(occupant) {
        return (occupant instanceof pieces.Bishop || occupant instanceof pieces.Horse || occupant instanceof pieces.Rook || occupant instanceof pieces.Dragon || occupant instanceof pieces.Lance);
    }

    noMovingThrough(target) {
        const vector = new Vector(this.coordinate, target);
        for (let i = 1; i < vector.magnitude; i++) {
            let interveningSquare = [this.coordinate[0] + vector.unitVector[0] * i, this.coordinate[1] + vector.unitVector[1] * i];
            if (this.checkOwner([interveningSquare])) return false;
        }
        return true;
    }
    
    render () {
        return {
            class: [this.owner],
            occupant: this.occupant ? this.occupant.symbol : ""
        }
    }
}

export default Square;