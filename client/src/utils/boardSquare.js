import pieces from "./pieces";
import {Vector, isOnBoard} from "./smallClasses";

class Square {
    constructor (i, j, checkOwner) {
        Object.defineProperty(this, "coordinate", {
            configurable: true,
            writable: false,
            value: [i, j]
        });

        // TODO: I'm trying to eliminate all methods that require a child to know about the parent.
        // I removed makeMove from boardSquare, but allowing the square to determine the basic move vector is very convenient, so it's proving hard to give up.
        this.checkOwner = checkOwner;
        this.owner = null;
        this.occupant = null;
    }
      
    addOccupant(piece, owner, doesPromote) {
        this.occupant = piece;
        this.owner = owner;

        if (doesPromote && this.occupant instanceof pieces.Promotable) {
            this.occupant = new this.occupant.promotion()
        }
    }

    removeOccupant() {
        const previousTenant = this.occupant;

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

        moveList = moveList.filter(isOnBoard);

        if (this.isRanged(this.occupant)) {
            moveList = moveList.filter(move => this.noMovingThrough.call(this, move));
        }

        // then map it into the text format for a move and return.
        return moveList.map(target => {return {origin: this.coordinate.join(""), target: target.join("")}});
    }

    isRanged(occupant) {
        return (occupant instanceof pieces.Bishop || occupant instanceof pieces.Horse || occupant instanceof pieces.Rook || occupant instanceof pieces.Dragon || occupant instanceof pieces.Lance);
    }

    noMovingThrough(target) {
        const vector = new Vector(this.coordinate, target);
        for (let i = 1; i < vector.magnitude; i++) {
            let interveningSquare = [this.coordinate[0] + vector.unitVector[0] * i, this.coordinate[1] + vector.unitVector[1] * i];
            if (this.checkOwner(interveningSquare.join(""))) return false;
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

export {Square};