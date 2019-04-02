import React, {Component} from "react";
import "./board.css";
import API from "../../utils/api";
import gameLogic from "../../utils/shogiBoard";
import {symbolDictionary} from "../../utils/dictionaries";
import PieceStand from "./pieceStand";
import BoardDisplay from "./boardDisplay";

class SelectionEvent {
    constructor (event, position, candidates) {
        this.event = event;
        this.position = position;
        this.candidates = candidates;
    }

    clearOldCandidates() {
        this.candidates.forEach(e => {
            // two items spliced here to remove both "candidate" and "friendly" or "hostile";
            this.position[e].class.splice(this.position[e].class.indexOf("candidate"), 2);
        });
        this.candidates = [];
        return {position: this.position, candidates: this.candidates};
    }

    determineMoveOrigin () {
        const classList = this.event.target.classList;
        if (classList.contains("handMult")) {
            return {origin: this.event.target.parentElement.parentElement.id, piece: symbolDictionary[this.event.target.parentElement.textContent[0]].name};
        } else if (classList.contains("pieceIcon")) {
            return {origin: this.event.target.parentElement.id, piece: symbolDictionary[this.event.target.textContent[0]].name};
        } else if (classList.contains("piece")) {
            return {origin: this.event.target.parentElement.id, motum: this.event.target.textContent};
        } else {
            return false;
        }
    }

    getNewSquares (move, status) {
        const candidates = this.identifyCandidates(move);
        candidates.forEach(e => {
            this.position[e].class.push("candidate", status);
        })
        return {position: this.position, candidates};
    }

    identifyCandidates (move) {
        if (!isNaN(move.origin)) return this.position[move.origin].moves;
        const dropSquares = this.position[move.origin+"Drops"]
            .filter(e => e.piece === move.piece)
            .map(e => e.target);
        return dropSquares;
    }
}


class Board extends Component {

    constructor (props) {
        super(props);
        this.state = {
            position: {},
            candidates: [],
        };

        this.setGameState = props.setGameState;
        this.restoreDefaults = props.restoreDefaults;
    }

    componentDidUpdate () {
        if (this.props.reportRequested) this.getGame();
    }

    componentDidMount () {
        this.getGame();
    }

    getGame () {
        API.getGame(this.props.access)
        .then(response => {
            const position = this.readGame(response.data.handicap, response.data.moves);

            this.setPosition(position);
            this.reportToGame(response.data, position);

        });
    }

    readGame (handicap, moves) {
        this.gameBoard = new gameLogic(handicap);
        this.gameBoard.initialize();
        this.gameBoard.readMoves(moves);
        return this.gameBoard.render();
    }

    setPosition (position) {
        this.setState({
            position,
            candidates: [],
        });
    }

    reportToGame(dbGame, position) {
        const viewer = this.props.access === dbGame.senteAccess ? "sente" : "gote";
        const {drawOffer, resigned} = dbGame;
        const {checkMate, inCheck, winner} = position;
        const opponentNick = viewer === "sente" ? dbGame.goteNick : dbGame.senteNick;
        const playerNick = dbGame[viewer+"Nick"];
        let canRespond = drawOffer && drawOffer !== viewer;
        const canPlay = viewer === this.gameBoard.turn && !(drawOffer || resigned || winner);
        const previousMessages = dbGame.messages || [];
        const moveNumber = dbGame.moves.length;
        

        this.setGameState({viewer, drawOffer, resigned, winner, opponentNick, canPlay, checkMate, inCheck, canRespond, reportRequested:false, previousMessages, moveNumber, playerNick});
    }

    localSetCandidates (event) {
        const candidateSelection = new SelectionEvent(event, this.state.position, this.state.candidates);
        let clearedPosition = candidateSelection.clearOldCandidates();
        const move = candidateSelection.determineMoveOrigin(event);
        if (!move) return this.reportCandidates(clearedPosition);
        const status = this.playerOwnsThis(event.target) ? "friendly" : "hostile";
        const newPosition = candidateSelection.getNewSquares(move, status);

        if (isNaN(move.origin)) move.origin += "Hand";
        newPosition.move = move;

        this.reportCandidates(newPosition);
    }

    reportCandidates (moveOptions) {
        const {position, candidates, move} = moveOptions;
        this.setState({position, candidates});
        this.setGameState({move: move || {}});
    }

    setCandidates = this.localSetCandidates.bind(this);

    playerOwnsThis(DOMElement) {
        return DOMElement.classList.contains(this.props.viewer) || DOMElement.parentElement.classList.contains(this.props.viewer) || DOMElement.parentElement.parentElement.classList.contains(this.props.viewer);
    }

    localPreviewMove (event) {
        if (!this.isCandidate(event.target)) return this.setCandidates(event);

        let move = this.props.move;
        let target = event.target.id || event.target.parentElement.id;
        move.target = target;
        move.isPromotable = this.isPromotable(move);

        this.setGameState({move});
    }

    isCandidate (square) {
        return square.classList.contains("friendly") || square.parentElement.classList.contains("friendly");
    }

    previewMove = this.localPreviewMove.bind(this);

    // true if a target is specified, the move is not a drop, and the origin or target are inside the enemy camp, and the piece is not already promoted.
    isPromotable (move) {
        return !isNaN(move.origin) && (this.isEnemyCamp(move.origin) || this.isEnemyCamp(move.target)) && !["と","杏","圭","全","金","馬","竜","玉","王"].includes(move.motum);
    }

    isEnemyCamp (coordinate) {
        return this.gameBoard.turn === "gote" ? coordinate % 10 > 6 : coordinate % 10 < 4;
    }

    render () {
        return (
            this.state.position[11] ?
            (<div id="boardContainer" className={this.props.viewer === "gote" ? "flipped" : null} onClick={this.state.candidates.length ? (this.props.canPlay ? this.previewMove : this.setCandidates) : this.setCandidates}>
                <PieceStand pieceStand={this.state.position.goteHand}/>
                <BoardDisplay {...this.state} {...this.props}/>
                <PieceStand pieceStand={this.state.position.senteHand}/>
            </div>)
            :
            null
        );
    }
}

export {Board};