import pieces from "./pieces";
import PieceStand from "./pieceStand";
import Square from "./boardSquare";

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

    // Options include: whether the piece certainly promoted, and whether the game should record this move as a move.
    makeMove (moveInfo, options) {
        const {origin, target, piece} = moveInfo;
        const doesPromote = options.doesPromote || false;
        const shouldRecord = options.hasOwnProperty("shouldRecord") ? options.shouldRecord : true;

        const recordMove = () => {
            this.lastMove = {};
            if (origin.search("Hand") !== -1) {
                this.lastMove = {type:"drop", origin, target, piece};
            } else if (this[target].occupant) {
                const originOccupant = this[origin].occupant;
                const targetOccupant = this[target].occupant;
                const capturedPiece = targetOccupant instanceof pieces.Promoted ? new targetOccupant.stand().name : targetOccupant.name;

                this.lastMove = {type: "capture", origin, originOccupant, target, targetOccupant, piece: capturedPiece};
            } else {
                const originOccupant = this[origin].occupant;
                const targetOccupant = this[target].occupant;
                
                this.lastMove = {type: "move", origin, originOccupant, target, targetOccupant};
            }
        }

        const enactMove = () => {

            const {occupant, owner} = this[origin].removeOccupant(piece || doesPromote);
            this[target].addOccupant(occupant, owner, doesPromote);

        }

        if(shouldRecord) recordMove();
        enactMove();
    }

    // this method is mainly for testing for checks. The deleteMove() method will delete the last move and replay from the start.
    undoMove(turn) {
        const {type, origin, target, piece, targetOccupant, originOccupant} = this.lastMove;

        if (type === "drop") {
            const revertedPiece = this[target].removeOccupant().occupant;
            this[origin].addOccupant(revertedPiece);
        } else if (type === "move") {
            this[target].removeOccupant();
            this[origin].addOccupant(originOccupant, turn);
        } else if (type === "capture") {
            this[target].removeOccupant();
            this[origin].addOccupant(originOccupant, turn);
            this[target].addOccupant(targetOccupant, this.changeTurn(turn));
            this[turn+"Hand"].removeOccupant(piece);
        }
    }

    niFu (owner, file) {
        for (let i = 1; i < 10; i++) {
            if (this[file+i].owner===owner && this[file+i].occupant instanceof pieces.Pawn) return true;
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

    getMoveList (turn, userOptions) {
        let options = {mustAvoidCheck: true, limitedCandidates: [], calculateDrops: true};
        if (userOptions) Object.assign(options, userOptions);

        let moves = [], drops = [], moveList={};
        if (options.limitedCandidates.length) {
            for (let i=0; i < options.limitedCandidates.length; i++) {
                if (this[options.limitedCandidates[i]].owner === turn) moves = moves.concat(this[options.limitedCandidates[i]].listMoves());
            }
        } else {
            for (let i=1; i<10; i++) {
                for (let j=1; j<10; j++) {
                    if (this[""+i+j].owner === turn) moves = moves.concat(this[""+i+j].listMoves());
                }
            }
            if (options.calculateDrops) drops = this[turn+"Hand"].listMoves();
        }
        moveList = !options.mustAvoidCheck ? {moves, drops} : this.filterIllegalMoves(moves, drops, turn);
        return moveList;
    }

    filterIllegalMoves(moves, drops, turn) {
        const kingThreats = this.findKingThreats(turn)
        const kingSquare = this.findKing(turn);
        if (this.isInCheck(turn)) {
            moves = moves.filter(move => isLegalMoveWhileChecked.apply(this, move));
            drops = drops.filter(drop => isLegalMoveWhileChecked.apply(this, drop))
        } else if (kingThreats.threats.length) {
            moves = moves.filter(move => isLegalMoveWhileNotChecked.apply(this, move));
        }

        return {moves, drops};

        function isLegalMoveWhileChecked(move) {
            const noKingCapture = this[move[1]].occupant instanceof pieces.King;
            const blocksCheck = kingThreats.allRelevant.includes(move[1]);
            const movesKing = move[0] === kingSquare;
            // check here and break if fails, since these checks are easy to run. noAutoCheck is more costly.
            if (!(noKingCapture && (blocksCheck || movesKing))) return false;

            const removesCheck = this.noAutoCheck(turn, move, []);
            return removesCheck;
        }

        function isLegalMoveWhileNotChecked (move) {
            const doesNotMoveIntoCheck = this.noAutoCheck(turn, move, kingThreats.interposita);
            return doesNotMoveIntoCheck;
        }
    }

    

    noAutoCheck (turn, move, threats) {
        const [origin, target, piece] = move;
        if (!threats.includes(origin) && threats.length) return true;

        this.makeMove({origin, target, piece}, {shouldRecord: true});
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

        const opponentMoves = this.getMoveList(this.changeTurn(turn), {mustAvoidCheck: false, limitedCandidates: this.findKingThreats(turn).threats});

        if (opponentMoves.moves.filter(e => e[1] === kingSquare).length) return true;
        return false;
    }

    isInCheckMate (turn) {
        if (!this.isInCheck(turn)) return false;


    }

    parseDrop (trinomialNotation) {
        return {origin: trinomialNotation[0], target: trinomialNotation[1], piece: trinomialNotation[2]}
    }

    render () {
        let currentPosition = {};
        let legalMoves = this.getMoveList(this.turn);
        if (!(legalMoves.moves.length || legalMoves.drops.length)) {
            currentPosition.checkMate = true;
            currentPosition.winner = this.changeTurn(this.turn);
        }
        if (this.isInCheck(this.turn)) {
            currentPosition.inCheck = true;
        }

        if (!currentPosition.checkMate) {
            const opponentMoves = this.getMoveList(this.changeTurn(this.turn));
            legalMoves.moves = legalMoves.moves.concat(opponentMoves.moves);
            legalMoves.opponentDrops = opponentMoves.drops;
        }

        for(let i = 1; i < 10; i++) {
            for (let j = 1; j < 10; j++) {
                currentPosition[""+i+j] = this[""+i+j].render();
                currentPosition[""+i+j].moves = legalMoves.moves.filter(e => e[0] === ""+i+j).map(e => e[1]);
            }
        }

        currentPosition.drops = legalMoves.drops.map(this.parseDrop);
        currentPosition.opponentDrops = legalMoves.opponentDrops.map(this.parseDrop);
        currentPosition.senteHand = this.senteHand.render();
        currentPosition.goteHand = this.goteHand.render();
        let lastMove = this.moves[this.moves.length-1] || null;
        lastMove = lastMove ? lastMove.split(lastMove.search("-") === -1 ? "*" : "-")[1] : null;
        currentPosition.lastMove = lastMove;

        return currentPosition;
    }
}

export default Board;