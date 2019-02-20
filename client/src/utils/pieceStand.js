class PieceStand {
    constructor(owner, niFu, checkSpace) {
        Object.defineProperty(this, "owner", {
            configurable: true,
            writable: false,
            value: owner
        });

        this.niFu = niFu;
        this.checkSpace = checkSpace;

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
        this.occupants[piece.capture().constructor.name.toLowerCase()].push(piece.capture());
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
            candidateFiles = [],
            moveList = [];

        // find out what pieces there are to drop.
        for (let piece in this.occupants) {
            if (this.occupants.hasOwnProperty(piece)) {
                if(this.occupants[piece].length) {
                    candidatePieces.push(piece);
                }
            }
        }

        // if there are any, find out which squares are eligible.
        if (candidatePieces.length) {
            for (let i = 1; i<10; i++) {
                for (let j=1; j<10; j++) {
                    if (!this.checkSpace(""+i+j)) {
                        candidateSquares.push([i, j]);
                    }
                }
            }    
        }

        // if there are any dropable pawns, identify the eligible files
        if (this.occupants.pawn.length) {
            for (let i=1; i<10; i++) {
                if (!this.niFu(this.owner, i.toString())) {
                    candidateFiles.push(i);
                }
            }
        }

        // now we know all the possibilities. Permute over them.
        candidatePieces.forEach(piece => {
            let candidates = candidateSquares.slice();
            if (piece === "pawn") {
                // this statement eliminates the ninth rank and obviates the specification of a limit in pawn class definition, at least as far as drops are concerned
                candidates = candidates.filter(square => candidateFiles.includes(square[0]) && square[1] !== (this.owner === "sente" ? 1 : 9));
            } else if (piece==="lance") {
                candidates = candidates.filter(square => !(this.owner === "sente" ? [9] : [1]).includes(square[1]));
            } else if (piece==="knight") {
                // The last part of this is a bit elaborate but means "if it's sente, don't let it be the 8th or 9th rank; if gote, not the 1st or 2nd." 
                candidates = candidates.filter(square => !(this.owner === "sente" ? [8, 9] : [1, 2]).includes(square[1]));
            }

            candidates.forEach(square => moveList.push([this.owner+"Hand", square.join(""), piece]));
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