import pieces from "./pieces";

class Square {
    constructor (i, j, checkSpace, transfer) {
        Object.defineProperty(this, "coordinate", {
            configurable: true,
            writable: false,
            value: [i, j]
        });

        this.checkSpace = checkSpace;
        this.transfer = transfer;
        this.owner = null;
        this.occupant = null;
    }
    

    capture() {
        this.transfer(this.coordinate.join(""), this.owner === "sente" ? "goteHand" : "senteHand");
    }

    addOccupant(piece, owner) {
        if (this.occupant) {
            this.capture();
        }

        this.occupant = piece;
        this.owner = owner;
    }

    removeOccupant() {
        const previousTenant = {occupant: this.occupant, owner: this.owner};
        this.occupant = null;
        this.owner = null;
        return previousTenant;
    }

    listMoves() {
        const handleRange = (piece) => {
            const oneDirection = (forward, sideways, multiplier) => {
                let moves = [];
                for (let i = 1; this.coordinate[1] + i*multiplier*forward > 0 
                    && this.coordinate[1] + i*multiplier*forward < 10
                    && this.coordinate[0] + i*multiplier*sideways > 0
                    && this.coordinate[0] + i*multiplier*sideways < 10; i++) {
                        let xCoord = this.coordinate[0]+i*multiplier*sideways;
                        let yCoord = this.coordinate[1]+i*multiplier*forward;
                        let targetSquare = ""+xCoord+yCoord
                        let targetOccupant = this.checkSpace(targetSquare);
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
                    moveList = moveList.concat(handleRange(e));
                    break;
                case "rook":
                    moveList = moveList.concat(handleRange(e));
                    break;
                case "bishop":
                    moveList = moveList.concat(handleRange(e));
                    break;
                default:
                    const move = e.map(coordinate => coordinate*(this.owner === "sente" ? -1 : 1));
                    moveList.push([this.coordinate[0]+move[0], this.coordinate[1]+move[1]])
            }
        });

        // filter the moves to remove any that are off the board or that would 'capture' a piece of the same side, then map it into the text format for a move and return.
        return moveList
            .filter(e => (e[0] < 10
                && e[1] < 10 
                && e[0] > 0 
                && e[1] > 0 
                && !(this.checkSpace(e.join(""))===this.owner)))
            .map(target => [this.coordinate.join(""), target.join("")]);
        
    }

    render () {
        return {
            class: this.owner,
            occupant: this.occupant ? this.occupant.symbol : ""
        }
    }
}

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
        candidatePieces.forEach(e => {
            let candidates = candidateSquares.slice();
            if (e === "pawn") {
                // this statement eliminates the ninth rank and obviates the specification of a limit in pawn class definition, at least as far as drops are concerned
                candidates = candidates.filter(square => candidateFiles.includes(square[0]) && square[1] !== (this.owner === "sente" ? 1 : 9));
            } else if (e==="knight") {
                // The last part of this is a bit elaborate but means "if it's sente, don't let it be the 8th or 9th rank; if gote, not the 1st or 2nd." 
                candidates = candidates.filter(square => candidateFiles.includes(square[0]) && !(this.owner === "sente" ? [8, 9] : [1, 2]).includes(square[1]));
            }

            candidates.forEach(square => moveList.push([e, square.join("")]));
        })

        return moveList;
    }

    render () {
        return [
            ["歩", this.occupants.pawn.length],
            ["香", this.occupants.lance.length],
            ["桂", this.occupants.knight.length],
            ["銀", this.occupants.silver.length],
            ["金", this.occupants.gold.length],
            ["角", this.occupants.bishop.length],
            ["飛", this.occupants.rook.length]
        ]
    }
}

class Board {
    constructor (handicap) {
        for (let i = 1; i<10; i++) {
            for (let j=1; j<10; j++) {
                this[""+i+j] = new Square(i, j, this.checkSpace.bind(this), this.transfer.bind(this));
            }
        }

        this.senteHand = new PieceStand("sente", this.niFu.bind(this), this.checkSpace.bind(this));
        this.goteHand = new PieceStand("gote", this.niFu.bind(this), this.checkSpace.bind(this));
        this.handicap = handicap
        this.turn = handicap ? "gote" : "sente";
        this.lastMove = {origin: null, target: null, piece: null};
        this.moves = [];
    }

    initialize(clearFirst=false) {
        if (clearFirst) {
            for (let i = 1; i<10; i++) {
                for (let j=1; j<10; j++) {
                    this[""+i+j].removeOccupant();
                }
            }
            this.goteHand.clear();
            this.senteHand.clear();
        }

        const arrayAdd = (array, Piece) => {
            array.forEach((e, i) => {
                this[e].addOccupant(new Piece(), i < array.length/2 ? "sente" : "gote");
            }) 
        }

        arrayAdd([99, 19, 11, 91], pieces.Lance);
        arrayAdd([29, 89, 21, 81], pieces.Knight);
        arrayAdd([39, 79, 31, 71], pieces.Silver);
        arrayAdd([49, 69, 41, 61], pieces.Gold);
        arrayAdd([59], pieces.King);
        this[51].addOccupant(new pieces.GKing(), "gote");
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

    changeTurn(turn) {
        return turn === "sente" ? "gote" : "sente";
    }

    checkSpace (coordinate) {
        if(this[coordinate].occupant) return this[coordinate].owner;
        return false;
    }

    transfer (loc1, loc2, piece, status=null) {

        if (status==="test") { 
            if (loc2.search("Hand") !== -1) {
                this.lastMove.piece = this[loc1].occupant;
                console.log("with capture", this.lastMove);
            } else if (loc1.search("Hand") !== -1) {
                this.lastMove = {origin: loc1, target: loc2, piece};
                this.moves.push()
                console.log("from hand", this.lastMove);
            } else {
                this.lastMove = {origin: loc1, target: loc2, piece: null};
                console.log("without capture", this.lastMove);
            }
        } else {
            this.lastMove = {origin: null, target: null, piece: null};
        }

        const {occupant, owner} = this[loc1].removeOccupant(piece);
        this[loc2].addOccupant(occupant, owner);
        if (loc2.search("Hand") === -1) this.turn = this.changeTurn(this.turn);
    }

    // this method is mainly for testing for checks. The deleteMove() method will delete the last move and replay from the start.
    undoMove() {
        const {loc1, loc2, piece} = this.lastMove;

        this.transfer(loc2, loc1);

        if (piece) this[loc2].addOccupant(piece, this.changeTurn(this.turn));
    }

    niFu (owner, file) {
        for (let i = 1; i < 10; i++) {
            if (this[file+i].owner===owner && this[file+i].occupant instanceof pieces.Pawn) return true;
        }
        return false;
    }

    makeMove (string) {
        let loc1, loc2, piece;
        if (string.split("-").length === 2) {
            [loc1, loc2] = string.split("-");
        } else {
            [piece, loc2] = string.split("*");
            loc1 = this.turn + "Hand";
        }
        
        this.moves.push(string);
        this.transfer(loc1, loc2, piece);
    }

    readMoves (array) {
        array.forEach(this.makeMove.bind(this));
    }

    findKing (turn) {
        for (let i=1; i<10; i++) {
            for (let j=1; j<10; j++) {
                if (this[""+i+j].owner === turn && this[""+i+j].occupant instanceof pieces.King) return ""+i+j;
            }
        }
    }

    getMoveList (turn) {
        let moveList = []
        for (let i=1; i<10; i++) {
            for (let j=1; j<10; j++) {
                if (this[""+i+j].owner === turn) {
                    moveList = moveList.concat(this[""+i+j].listMoves());
                }
            }
        }
        moveList = moveList.concat(this[turn+"Hand"].listMoves());
        return moveList;
    }

    isInCheck (turn) {
        const kingSquare = this.findKing(turn);

        const opponentMoves = this.getMoveList(this.changeTurn(turn));

        if (opponentMoves.filter(e => e[1] === kingSquare).length) return true;
        return false;
    }

    isInCheckMate (turn) {
        if (!this.isInCheck(turn)) return false;


    }

    render () {
        let currentPosition = {};
        let legalMoves = this.getMoveList(this.turn);
        for(let i = 1; i < 10; i++) {
            for (let j = 1; j < 10; j++) {
                currentPosition[""+i+j] = this[""+i+j].render();
                currentPosition[""+i+j].moves = legalMoves.filter(e => e[0] === ""+i+j).map(e => e[1]);
            }
        }

        currentPosition.senteHand = this.senteHand.render();
        currentPosition.goteHand = this.goteHand.render();

        return currentPosition;
    }
}

export default Board;