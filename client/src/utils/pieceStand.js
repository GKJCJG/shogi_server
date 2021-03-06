class PieceStand {
    constructor(owner) {
        Object.defineProperty(this, "owner", {
            configurable: true,
            writable: false,
            value: owner
        });

        this.occupants = {
            pawn: [],
            lance: [],
            knight: [],
            silver: [],
            gold: [],
            bishop: [],
            rook: []
        };
    };

    addOccupant(piece) {
        const newOccupant = piece.capture();
        this.occupants[newOccupant.name].push(newOccupant);
    };

    removeOccupant(piece) {
        return {occupant: this.occupants[piece].pop(), owner: this.owner};
    };

    clear() {
        this.occupants = {
            pawn: [],
            lance: [],
            knight: [],
            silver: [],
            gold: [],
            bishop: [],
            rook: []
        };
    }

    listMoves() {
        const candidatePieces = [],
            candidateSquares = [],
            moveList = [];

        // find out what pieces there are to drop.
        for (let piece in this.occupants) {
            if (this.occupants.hasOwnProperty(piece)) {
                if(this.occupants[piece].length) {
                    candidatePieces.push(piece);
                }
            }
        }

        // if there are any, set all squares eligible.
        if (candidatePieces.length) {
            for (let i = 1; i<10; i++) {
                for (let j=1; j<10; j++) {
                    candidateSquares.push([i, j]);
                }
            }    
        }

        // now we know all the possibilities. Permute over them.
        candidatePieces.forEach(piece => {
            let candidates = candidateSquares.slice();
            if (piece === "pawn" || piece === "lance") {
                candidates = candidates.filter(square => square[1] !== (this.owner === "sente" ? 1 : 9));
            } else if (piece==="knight") {
                candidates = candidates.filter(square => !((this.owner === "sente" ? [1, 2] : [8, 9]).includes(square[1])));
            }

            candidates.forEach(square => moveList.push({origin: this.owner+"Hand", target: square.join(""), piece}));
        })

        return moveList;
    }

    render () {
        return {
                class: this.owner,
                occupants: [
                {symbol: "歩", number: this.occupants.pawn.length, name: "pawn"},
                {symbol: "香", number: this.occupants.lance.length, name: "lance"},
                {symbol: "桂", number: this.occupants.knight.length, name: "knight"},
                {symbol: "銀", number: this.occupants.silver.length, name: "silver"},
                {symbol: "金", number: this.occupants.gold.length, name: "gold"},
                {symbol: "角", number: this.occupants.bishop.length, name: "bishop"},
                {symbol: "飛", number: this.occupants.rook.length, name: "rook"}
            ],
        }
    }
}

export default PieceStand