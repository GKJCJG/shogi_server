import React, {Component} from "react";
import "./board.css";
import API from "../../utils/api";
import gameLogic from "../../utils/shogiBoard";
import PieceStand from "./pieceStand";
import BoardDisplay from "./boardDisplay"

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
        const markSquares = (coordinates) => {
            const status = this.playerOwnsThis(event.target) ? "friendly" : "hostile";
            coordinates.forEach(e => {
                position[e].class.push("candidate", status);
                candidates.push(e);
            })
        }

        // retrieve position and candidates.
        let {position, candidates} = this.state;
        
        //Clear existing candidates.
        candidates.forEach(e => {
            // two items spliced here to remove both "candidate" and "friendly" or "hostile";
            position[e].class.splice(position[e].class.indexOf("candidate"), 2);
        });

        candidates = [];
        let move = {};


        // use DOM properties of board elements to calculate appropriate new candidates.
        if(event.target.classList.contains("boardSquare")) {
            if (position[event.target.id].moves.length) {
                markSquares(position[event.target.id].moves);
                move.origin = event.target.id
                move.motum = event.target.textContent;
            }
        } else if (event.target.classList.contains("handMult") || event.target.classList.contains("pieceIcon")) {
            const searchLocale = this.playerOwnsThis(event.target) ? "drops" : "opponentDrops";

            // retrieve piece type
            const dropPiece = event.target.classList.contains("handMult") ? event.target.parentElement.id.split("-")[1] : event.target.id.split("-")[1];
            
            // identify and mark target squares
            let dropSquares = position[searchLocale]
                .filter(e => e.piece === dropPiece)
                .map(e => e.target);
            markSquares(dropSquares);

            // assign relevant properties to move.
            move.origin = event.target.parentElement.id.split("-")[0] + "Hand";
            move.piece = dropPiece;
        }


        this.setState({position, candidates});
        this.setGameState({move})
    }

    setCandidates = this.localSetCandidates.bind(this);

    playerOwnsThis(DOMElement) {
        return DOMElement.classList.contains(this.props.viewer) || DOMElement.parentElement.classList.contains(this.props.viewer) || DOMElement.parentElement.parentElement.classList.contains(this.props.viewer);
    }

    localPreviewMove (event) {
        if (!event.target.classList.contains("candidate") || event.target.classList.contains(this.props.viewer)) return this.setCandidates(event);
        if (event.target.classList.contains("hostile")) return;

        let move = this.props.move;
        let target = event.target.id;
        move.target = target;
        move.isPromotable = this.isPromotable(move);

        this.setGameState({move});
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
            (<div id="diagramContainer" className={this.props.viewer === "gote" ? "flipped" : null} onClick={this.state.candidates.length ? (this.props.canPlay ? this.previewMove : this.setCandidates) : this.setCandidates}>
                <PieceStand pieceStand={this.state.position.goteHand}/>
                <table className="shogiDiagram">
                    <BoardDisplay {...this.state} {...this.props}/>
                </table>
                <PieceStand pieceStand={this.state.position.senteHand}/>
            </div>)
            :
            null
        );
    }
}

export {Board};