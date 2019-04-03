import pieces from "./pieces";
import PieceStand from "./pieceStand";
import {Square, Vector} from "./boardSquare";

function otherSide(side) {
    return side === "sente" ? "gote" : "sente";
}

class ShogiPosition {
    constructor(object) {
        Object.assign(this, object);
        this.senteKing = this.findKing("sente");
        this.goteKing = this.findKing("gote");
        this.moves = {
            senteMoves: [],
            senteDrops: [],
            goteMoves: [],
            goteDrops: []
        };
        this.senteTargets = [];
        this.goteTargets = [];
        this.sentePins = [];
        this.gotePins = [];
        this.senteIsAttackedBy = [];
        this.goteIsAttackedBy = []; 
    }

    findKing (turn) {
        for (let i=1; i<10; i++) {
            for (let j=1; j<10; j++) {
                if (this[""+i+j].owner === turn && this[""+i+j].occupant instanceof pieces.King) return ""+i+j;
            }
        }
    }

    getMoveList () {
        this.populateMoves();
        this.filterIllegalMoves();
        return this.moves;
    }

    populateMoves () {
        for (let i=1; i<10; i++) {
            for (let j=1; j<10; j++) {
                if (this[""+i+j].occupant) Array.prototype.push.apply(this.moves[this[""+i+j].owner + "Moves"], this[""+i+j].listMoves());
            }
        }
        this.moves.senteDrops = this["senteHand"].listMoves();
        this.moves.goteDrops = this["goteHand"].listMoves();
    }

    filterIllegalMoves(moves) {
        this.establishTargets();
        this.determineCheck();
        this.handleCheckRules();
    }

    establishTargets() {
        this.senteTargets = this.moves.senteMoves.map(e => e.target);
        this.goteTargets = this.moves.goteMoves.map(e => e.target);
    }

    determineCheck() {
        this.senteIsAttackedBy = this.moves.goteMoves.filter(e => e.target === this.senteKing).map(e => e.origin);
        this.goteIsAttackedBy = this.moves.senteMoves.filter(e => e.target === this.goteKing).map(e => e.origin);
        this.senteInCheck = this.senteIsAttackedBy.length > 0;
        this.goteInCheck = this.goteIsAttackedBy.length > 0;
    }

    handleCheckRules() {
        this.preventMoveIntoCheck();
        this.preventAutoCapture(); // This must follow preventing move into check, because otherwise the king could capture a piece that is protected.
        this.identifyRangedThreats("sente");
        this.identifyRangedThreats("gote");
        this.enforcePins();
        if (this.senteInCheck) this.mustEscapeCheck("sente");
        if (this.goteInCheck) this.mustEscapeCheck("gote");
        this.noCheckMateByDroppedPawn("sente");
        this.noCheckMateByDroppedPawn("gote");
    }

    preventMoveIntoCheck() {
        this.moves.senteMoves = this.moves.senteMoves.filter(e => !(e.origin === this.senteKing && this.goteTargets.includes(e.target)));
        this.moves.goteMoves = this.moves.goteMoves.filter(e => !(e.origin === this.goteKing && this.senteTargets.includes(e.target)));
    }

    preventAutoCapture() {
        this.moves.senteMoves = this.moves.senteMoves.filter(move => this[move.target].owner !== "sente");
        this.moves.goteMoves = this.moves.goteMoves.filter(move => this[move.target].owner !== "gote");
    }

    identifyRangedThreats(defender) {
        const attacker = otherSide(defender);
        const vectors = [
            {
                vector: [0, 1],
                threats: {both: ["rook", "dragon"], gote: ["lance"], sente: []}
            },
            {
                vector: [1, 1],
                threats: {both: ["bishop", "horse"], gote: [], sente: []}
            },
            {
                vector: [1, 0],
                threats: {both: ["rook", "dragon"], gote: [], sente: []}
            },
            {
                vector: [1, -1],
                threats: {both: ["bishop", "horse"], gote: [], sente: []}
            },
            {
                vector: [0, -1],
                threats: {both: ["rook", "dragon"], gote: [], sente: ["lance"]}
            },
            {
                vector: [-1, -1],
                threats: {both: ["bishop", "horse"], gote: [], sente: []}
            },
            {
                vector: [-1, 0],
                threats: {both: ["rook", "dragon"], gote: [], sente: []}
            },
            {
                vector: [-1, 1],
                threats: {both: ["bishop", "horse"], gote: [], sente: []}
            }
        ]
        const kingSquare = Vector.format(this[defender+"King"]);

        for (let i = 0; i < vectors.length; i++) {
            const currentVector = vectors[i];
            const blockers = [];
            let threat = null;
            let magnitude = 1;
            let currentCheck = [kingSquare[0] + currentVector.vector[0], kingSquare[1] + currentVector.vector[1]];
            while (Square.isOnBoard(currentCheck)) {
                const currentCheckCoord = currentCheck.join("");
                if (this[currentCheckCoord].owner === defender) blockers.push(currentCheckCoord);
                if (blockers.length > 1) break;
                if (this[currentCheckCoord].owner === attacker) {
                    if (currentVector.threats.both.includes(this[currentCheckCoord].occupant.name) || currentVector.threats[defender].includes(this[currentCheckCoord].occupant.name)) threat = currentCheckCoord;
                    break;
                }

                magnitude++;
                currentCheck = [kingSquare[0] + currentVector.vector[0] * magnitude, kingSquare[1] + currentVector.vector[1] * magnitude];
            }

            if (threat && blockers.length) this[defender+"Pins"].push(blockers[0]);
        }
    }

    enforcePins() {
        this.moves.goteMoves = this.moves.goteMoves.filter(move => pinFilter.call(this, "gote", move));
        this.moves.senteMoves = this.moves.senteMoves.filter(move => pinFilter.call(this, "sente", move));

        function pinFilter (side, move) {
            if (!this[side+"Pins"].includes(move.origin)) return true;
            const kingSquare = Vector.format(this[side+"King"]);
            const origin = Vector.format(move.origin);
            const target = Vector.format(move.target);
            const currentVector = new Vector(kingSquare, origin);
            const newVector = new Vector(kingSquare, target);
            return Vector.areSameDirection(currentVector, newVector);
        }
    }
    
    mustEscapeCheck(side) {
        const kingSquare = this[side+"King"];
        const kingCoord = Vector.format(kingSquare);
        const attackers = this[side+"IsAttackedBy"];
        let moves = this.moves[side+"Moves"];
        let drops = this.moves[side+"Drops"];
        
        if (attackers.length > 1) {
            moves = moves.filter(move => move.origin === kingSquare);
            drops = [];
        } else {
            const threat = attackers[0];
            if (new Vector(kingCoord, Vector.format(threat)).magnitude === 1 || this[threat].occupant.name === "knight") {
                moves = moves.filter(move => move.origin === kingSquare || move.target === threat);
                drops = [];
            } else {
                moves = moves.filter(move => checkFilter.call(this, move, threat));
                drops = drops.filter(drop => checkFilter.call(this, drop, threat));
            }
        }
        this.moves[side+"Moves"] = moves;
        this.moves[side+"Drops"] = drops;

        function checkFilter (move, threat) {
            const threatVector = new Vector (kingCoord, Vector.format(threat));
            const newVector = new Vector(kingCoord, Vector.format(move.target));
            const movesKing = (move.origin === kingSquare);
            const blocksThreat = (Vector.areSameDirection(threatVector, newVector) && newVector.magnitude < threatVector.magnitude);
            const capturesThreat = (move.target === threat);
            return (movesKing || blocksThreat || capturesThreat);
        }
    }

    noCheckMateByDroppedPawn(side) {
        const opponent = otherSide(side);
        if ((this[side+"Hand"]).occupants.pawn.length === 0 || this[opponent+"InCheck"]) return;
        const headFinder = opponent === "gote" ? 1 : -1;
        const opponentKing = this[opponent+"King"];
        const opponentKingHead = [opponentKing[0], Vector.format(opponentKing)[1] + headFinder].join("");
        let index = findDropOnHead.call(this, side);

        if (index === -1) return;

        const isCheckMate = this.moves[opponent+"Moves"].filter(move => move.origin === opponentKing || move.target === opponentKingHead).length === 0;

        if (isCheckMate) this.moves[side+"Drops"].splice(index, 1);

        function findDropOnHead(side) {
            let index = -1;
            for (let i = 0; i < this.moves[side+"Drops"].length; i++) {
                const drop = this.moves[side+"Drops"][i];
                if (drop.piece === "pawn" && drop.target === opponentKingHead) {
                    index = i;
                    break;
                }
            }
            return index;
        }
    }


}

class Board {
    constructor (handicap) {
        this.position = {};
        for (let i = 1; i<10; i++) {
            for (let j=1; j<10; j++) {
                this.position[""+i+j] = new Square(i, j, this.checkOwner.bind(this), this.makeMove.bind(this));
            }
        }

        this.position.senteHand = new PieceStand("sente", this.niFu.bind(this), this.checkOwner.bind(this));
        this.position.goteHand = new PieceStand("gote", this.niFu.bind(this), this.checkOwner.bind(this));
        this.handicap = handicap
        this.turn = handicap ? "gote" : "sente";
        this.lastMove = {origin: null, target: null, piece: null};
        this.moves = [];
    }

    initialize(clearFirst=false) {
        if (clearFirst) {
            for (let i = 1; i<10; i++) {
                for (let j=1; j<10; j++) {
                    this.position[""+i+j].removeOccupant();
                }
            }
            this.position.goteHand.clear();
            this.position.senteHand.clear();
        }

        const arrayAdd = (array, Piece) => {
            array.forEach((e, i) => {
                this.position[e].addOccupant(new Piece(), i < array.length/2 ? "sente" : "gote");
            }) 
        }

        arrayAdd([99, 19, 11, 91], pieces.Lance);
        arrayAdd([29, 89, 21, 81], pieces.Knight);
        arrayAdd([39, 79, 31, 71], pieces.Silver);
        arrayAdd([49, 69, 41, 61], pieces.Gold);
        arrayAdd([59], pieces.King);
        this.position[51].addOccupant(new pieces.GKing(), "gote");
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
                this.position["82"].removeOccupant();
                //fallsthrough
            case "lance":
                this.position["11"].removeOccupant();
                break;
            case "bishop":
                this.position["22"].removeOccupant();
                break;
            // the following cases build on each other
            case "ten-piece":
                this.position["61"].removeOccupant();
                //fallsthrough
            case "nine-piece":
                this.position["41"].removeOccupant();
                //fallsthrough
            case "eight-piece":
                this.position["71"].removeOccupant();
                //fallsthrough
            case "seven-piece":
                this.position["31"].removeOccupant();
                //fallsthrough
            case "six-piece":
                this.position["81"].removeOccupant();
                //fallsthrough
            case "five-piece":
                this.position["21"].removeOccupant();
                //fallsthrough
            case "four-piece":
                this.position["11"].removeOccupant();
                //fallsthrough
            case "three-piece":
                this.position["91"].removeOccupant();
                //fallsthrough
            case "two-piece":
                this.position["22"].removeOccupant();
                //fallsthrough
            case "rook":
                this.position["82"].removeOccupant();
                break;
            default: break;
        }
    }

    checkOwner (coordinate) {
        if(this.position[coordinate].occupant) return {owner: this.position[coordinate].owner, occupant: this.position[coordinate].occupant};
        return false;
    }

    // Options include: whether the piece certainly promoted, and whether the game should record this move as a move.
    makeMove (moveInfo, options) {
        const {origin, target, piece} = moveInfo;
        const doesPromote = options.doesPromote || false;

        const recordMove = () => {
            this.lastMove = {};
            if (origin.search("Hand") !== -1) {
                this.lastMove = {type:"drop", origin, target, piece};
            } else if (this.position[target].occupant) {
                const originOccupant = this.position[origin].occupant;
                const targetOccupant = this.position[target].occupant;
                const capturedPiece = targetOccupant instanceof pieces.Promoted ? new targetOccupant.stand().name : targetOccupant.name;

                this.lastMove = {type: "capture", origin, originOccupant, target, targetOccupant, piece: capturedPiece};
            } else {
                const originOccupant = this.position[origin].occupant;
                const targetOccupant = this.position[target].occupant;
                
                this.lastMove = {type: "move", origin, originOccupant, target, targetOccupant};
            }
        }

        const enactMove = () => {

            const {occupant, owner} = this.position[origin].removeOccupant(piece || doesPromote);
            this.position[target].addOccupant(occupant, owner, doesPromote);

        }

        recordMove();
        enactMove();
    }

    // this method is mainly for testing for checks. The deleteMove() method will delete the last move and replay from the start.
    undoMove(turn) {
        const {type, origin, target, piece, targetOccupant, originOccupant} = this.lastMove;

        if (type === "drop") {
            const revertedPiece = this.position[target].removeOccupant().occupant;
            this.position[origin].addOccupant(revertedPiece);
        } else if (type === "move") {
            this.position[target].removeOccupant();
            this.position[origin].addOccupant(originOccupant, turn);
        } else if (type === "capture") {
            this.position[target].removeOccupant();
            this.position[origin].addOccupant(originOccupant, turn);
            this.position[target].addOccupant(targetOccupant, otherSide(turn));
            this.position[turn+"Hand"].removeOccupant(piece);
        }
    }

    niFu (owner, file) {
        for (let i = 1; i < 10; i++) {
            if (this.position[file+i].owner===owner && this.position[file+i].occupant instanceof pieces.Pawn) return true;
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
        this.turn = otherSide(this.turn);
    }

    readMoves (array) {
        array.forEach(this.readOneMove.bind(this));
    }

    render () {
        let positionAnalyser = new ShogiPosition(this.position);
        const legalMoves = positionAnalyser.getMoveList();
        let currentPosition = {};

        const playerMoves = legalMoves[this.turn+"Moves"];
        const playerDrops = legalMoves[this.turn+"Drops"];
        const opponentMoves = legalMoves[otherSide(this.turn) + "Moves"];
        const allMoves = playerMoves.concat(opponentMoves);

        if (!(playerMoves.length || playerDrops.length)) {
            currentPosition.checkMate = true;
            currentPosition.winner = otherSide(this.turn);
        }

        currentPosition.inCheck = positionAnalyser[this.turn+"InCheck"];

        for(let i = 1; i < 10; i++) {
            for (let j = 1; j < 10; j++) {
                currentPosition[""+i+j] = this.position[""+i+j].render();
                currentPosition[""+i+j].moves = allMoves.filter(e => e.origin === ""+i+j).map(e => e.target);
            }
        }
        currentPosition.senteHand = this.position.senteHand.render();
        currentPosition.goteHand = this.position.goteHand.render();



        currentPosition.senteDrops = legalMoves.senteDrops;
        currentPosition.goteDrops = legalMoves.goteDrops;
        let lastMove = this.moves[this.moves.length-1] || null;
        lastMove = lastMove ? lastMove.split(lastMove.search("-") === -1 ? "*" : "-")[1] : null;
        currentPosition.lastMove = lastMove;

        return currentPosition;
    }
}

export default Board;