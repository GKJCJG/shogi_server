import {Vector, Square} from "./boardSquare";
import pieces from "./pieces";

function otherSide(side) {
    return side === "sente" ? "gote" : "sente";
}

class MoveFinder {
    constructor(position) {
        this.position = position;
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
                if (this.position[""+i+j].owner === turn && this.position[""+i+j].occupant instanceof pieces.King) return ""+i+j;
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
                if (this.position[""+i+j].occupant) Array.prototype.push.apply(this.moves[this.position[""+i+j].owner + "Moves"], this.position[""+i+j].listMoves());
            }
        }
        this.moves.senteDrops = this.position.senteHand.listMoves();
        this.moves.goteDrops = this.position.goteHand.listMoves();
    }

    filterIllegalMoves() {
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
        this.preventAutoCapture(); // This must follow preventMoveIntoCheck, because otherwise the king could capture a piece that is protected.
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
        this.moves.senteMoves = this.moves.senteMoves.filter(move => this.position[move.target].owner !== "sente");
        this.moves.goteMoves = this.moves.goteMoves.filter(move => this.position[move.target].owner !== "gote");
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
                if (this.position[currentCheckCoord].owner === defender) blockers.push(currentCheckCoord);
                if (blockers.length > 1) break;
                if (this.position[currentCheckCoord].owner === attacker) {
                    if (currentVector.threats.both.includes(this.position[currentCheckCoord].occupant.name) || currentVector.threats[defender].includes(this.position[currentCheckCoord].occupant.name)) threat = currentCheckCoord;
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

        const rangedAttackers = attackers.filter(attacker => ["lance", "bishop", "horse", "rook", "dragon"].includes(this.position[attacker].occupant.name));
        if (rangedAttackers.length) {
            for (let i = 0; i < rangedAttackers.length; i++) {
                const attacker = Vector.format(rangedAttackers[i]);
                const attackVector = new Vector(kingCoord, attacker);
                moves = moves.filter(move => {
                    if (move.origin !== kingSquare) return true;
                    const newVector = new Vector(Vector.format(move.target), attacker);
                    return !Vector.areSameDirection(attackVector, newVector);
                });
            }
        }
        
        if (attackers.length > 1) {
            moves = moves.filter(move => move.origin === kingSquare);
            drops = [];
        } else {
            const threat = attackers[0];
            if (new Vector(kingCoord, Vector.format(threat)).magnitude === 1 || this.position[threat].occupant.name === "knight") {
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
        if ((this.position[side+"Hand"]).occupants.pawn.length === 0 || this[opponent+"InCheck"]) return;
        const headFinder = opponent === "gote" ? 1 : -1;
        const opponentKing = this[opponent+"King"];
        const opponentKingHead = [opponentKing[0], Vector.format(opponentKing)[1] + headFinder].join("");
        let index = this.moves[side+"Drops"].findIndex(drop => drop.piece === "pawn" && drop.target === opponentKingHead);

        if (index === -1) return;

        const isCheckMate = this.moves[opponent+"Moves"].filter(move => move.origin === opponentKing || move.target === opponentKingHead).length === 0;

        if (isCheckMate) this.moves[side+"Drops"].splice(index, 1);
    }
}

export {MoveFinder};