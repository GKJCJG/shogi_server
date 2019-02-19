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
        this.makeMove(this.coordinate.join(""), this.owner === "sente" ? "goteHand" : "senteHand");
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
                    // filter the moves to remove any that are off the board or that would 'capture' a piece of the same side. Not necessary for ranged pieces as their logic handes it.
                    moveList=moveList.filter(e => (e[0] < 10
                        && e[1] < 10 
                        && e[0] > 0 
                        && e[1] > 0 
                        && !(this.checkSpace(e.join(""))===this.owner)))
            }
        });

        // then map it into the text format for a move and return.
        return moveList.map(target => [this.coordinate.join(""), target.join("")]);
        
    }

    render () {
        return {
            class: [this.owner],
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

class Board {
    constructor (handicap) {
        for (let i = 1; i<10; i++) {
            for (let j=1; j<10; j++) {
                this[""+i+j] = new Square(i, j, this.checkSpace.bind(this), this.makeMove.bind(this));
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

    makeMove (loc1, loc2, piece, shouldRecord=true) {

        const recordMove = () => {
            

            if (loc2.search("Hand") !== -1) {
                this.lastMove.piece = this[loc1].occupant;
            } else if (loc1.search("Hand") !== -1) {
                this.lastMove = {origin: loc1, target: loc2, piece};
            } else {
                this.lastMove = {origin: loc1, target: loc2, piece: null};
            }
        }

        const enactMove = () => {

            const {occupant, owner} = this[loc1].removeOccupant(piece);
            this[loc2].addOccupant(occupant, owner);

        }

        if(shouldRecord) recordMove();
        enactMove();
    }

    // this method is mainly for testing for checks. The deleteMove() method will delete the last move and replay from the start.
    undoMove(turn) {
        const {origin, target, piece} = this.lastMove;

        this.makeMove(target, origin, null, false);

        if (piece && origin.search("Hand") === -1) {
            this.makeMove(turn+"Hand", target, piece.constructor.name.toLowerCase(), false);
            this[target].owner = this.changeTurn(this[target].owner);
        }
    }

    niFu (owner, file) {
        for (let i = 1; i < 10; i++) {
            if (this[file+i].owner===owner && this[file+i].occupant instanceof pieces.Pawn) return true;
        }
        return false;
    }

    readOneMove (string) {
        let loc1, loc2, piece;
        
        if (string.split("-").length === 2) {
            [loc1, loc2] = string.split("-");
        } else {
            [piece, loc2] = string.split("*");
            loc1 = this.turn + "Hand";
        }
        
        this.moves.push(string);
        this.makeMove(loc1, loc2, piece);
        this.turn = this.changeTurn(this.turn);
    }

    readMoves (array) {
        array.forEach(this.readOneMove.bind(this));
    }

    findKing (turn) {
        for (let i=1; i<10; i++) {
            for (let j=1; j<10; j++) {
                if (this[""+i+j].owner === turn && this[""+i+j].occupant instanceof pieces.King) return ""+i+j;
            }
        }
    }

    getMoveList (turn, mustAvoidCheck=true, limitedCandidates=[]) {
        let moveList = []
        if (limitedCandidates.length) {
            for (let i=0; i < limitedCandidates.length; i++) {
                if (this[limitedCandidates[i]].owner === turn) moveList = moveList.concat(this[limitedCandidates[i]].listMoves());
            }
        } else {
            for (let i=1; i<10; i++) {
                for (let j=1; j<10; j++) {
                    if (this[""+i+j].owner === turn) moveList = moveList.concat(this[""+i+j].listMoves());
                }
            }
            moveList = moveList.concat(this[turn+"Hand"].listMoves());

            const kingThreats = this.findKingThreats(turn)
            const kingSquare = this.findKing(turn);
            if (mustAvoidCheck && this.isInCheck(turn)) {
                moveList = moveList
                    .filter(move => !(this[move[1]].occupant instanceof pieces.King))
                    .filter(move => kingThreats.allRelevant.includes(move[1]) || move[0] === kingSquare)
                    .filter(move => this.noAutoCheck(turn, move, []));
            } else if (mustAvoidCheck && kingThreats.threats.length) {
                moveList = moveList
                    .filter(move => this.noAutoCheck(turn, move, kingThreats.interposita))
            }
        }
        return moveList;
    }

    noAutoCheck (turn, move, threats) {
        const [loc1, loc2, piece] = move;
        if (!threats.includes(loc1) && threats.length) return true;

        this.makeMove(loc1, loc2, piece);
        let wouldBeCheck = this.isInCheck(turn);
        this.undoMove(turn);

        return !wouldBeCheck;
    }

    findKingThreats (turn) {
        let kingSquare = this.findKing(turn)
        kingSquare = [parseInt(kingSquare[0]),parseInt(kingSquare[1])]
        let potentialThreats = [];

        for (let i=1; i < 9; i++) {
            potentialThreats.push(
                [kingSquare[0]+i, kingSquare[1]],
                [kingSquare[0]-i, kingSquare[1]],
                [kingSquare[0], kingSquare[1]+i],
                [kingSquare[0], kingSquare[1]-i],
                [kingSquare[0]+i, kingSquare[1]+i],
                [kingSquare[0]-i, kingSquare[1]+i],
                [kingSquare[0]-i, kingSquare[1]-i],
                [kingSquare[0]+i, kingSquare[1]-i]
            )
        }
        potentialThreats = potentialThreats.filter(e => e[0] > 0 && e[0] < 10 && e[1] > 0 && e[1] < 10).map(e => e.join(""));

        let threats = potentialThreats.filter(e => this[e].owner === this.changeTurn(turn));
        let interposita = potentialThreats.filter(e => this[e].owner === turn);

        
        return {threats, interposita, allRelevant: potentialThreats};
    }

    isInCheck (turn) {
        const kingSquare = this.findKing(turn);

        const opponentMoves = this.getMoveList(this.changeTurn(turn), false, this.findKingThreats(turn).threats);

        if (opponentMoves.filter(e => e[1] === kingSquare).length) return true;
        return false;
    }

    isInCheckMate (turn) {
        if (!this.isInCheck(turn)) return false;


    }

    render () {
        let currentPosition = {};
        let legalMoves = this.getMoveList(this.turn);
        if (!legalMoves.length) {
            currentPosition.checkMate = true;
            currentPosition.winner = this.changeTurn(this.turn);
        }
        if (this.isInCheck(this.turn)) {
            currentPosition.inCheck = true;
        }

        for(let i = 1; i < 10; i++) {
            for (let j = 1; j < 10; j++) {
                currentPosition[""+i+j] = this[""+i+j].render();
                currentPosition[""+i+j].moves = legalMoves.filter(e => e[0] === ""+i+j).map(e => e[1]);
            }
        }

        currentPosition.drops = legalMoves.filter(e => isNaN(e[0])).map(e => {return {origin: e[0], target: e[1], piece: e[2]}});
        currentPosition.senteHand = this.senteHand.render();
        currentPosition.goteHand = this.goteHand.render();
        let lastMove = this.moves[this.moves.length-1] || null;
        lastMove = lastMove ? lastMove.split(lastMove.search("-") === -1 ? "*" : "-")[1] : null;
        currentPosition.lastMove = lastMove;

        return currentPosition;
    }
}

export default Board;