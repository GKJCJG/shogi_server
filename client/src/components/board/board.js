import React, {Component} from "react";
import "./board.css";
import API from "../../utils/api";
import gameLogic from "../../utils/shogiBoard";
import PieceStand from "./pieceStand";
import PlaySpace from "./playSpace"

class Board extends Component {

    constructor (props) {
        super(props);
        this.state = {
            position: {},
            candidates: [],
            stage: "touch",
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
            stage: "touch",
        });
    }

    reportToGame(dbGame, position) {
        const viewer = this.props.access === dbGame.senteAccess ? "sente" : "gote";
        const {drawOffer, resigned} = dbGame;
        const {checkMate, inCheck, winner, lastMove} = position;
        const opponentNick = viewer === "sente" ? dbGame.goteNick : dbGame.senteNick;
        let canRespond = drawOffer && drawOffer !== viewer;
        const canPlay = viewer === this.gameBoard.turn && !(drawOffer || resigned || winner);
        this.setGameState({viewer, drawOffer, resigned, winner, opponentNick, canPlay, checkMate, inCheck, lastMove, canRespond, reportRequested:false});
    }

    localSetCandidates (event) {
        function markSquares (coordinates) {
            coordinates.forEach(e => {
                position[e].class.push("candidate");
                candidates.push(e);
            })
        }

        // retrieve position and candidates.
        let {position, candidates} = this.state;
        
        //Clear existing candidates.
        candidates.forEach(e => {
            position[e].class.splice(position[e].class.indexOf("candidate"), 1);
        });

        // let game know that we're not ready
        this.setGameState({APIready: false})
        
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
            // retrieve piece type
            let dropPiece = event.target.classList.contains("handMult") ? event.target.parentElement.id.split("-")[1] : event.target.id.split("-")[1];
            
            // identify and mark target squares
            let dropSquares = position.drops
                .filter(e => e.piece === dropPiece)
                .map(e => e.target);
            markSquares(dropSquares);

            // assign relevant properties to move.
            move.origin = event.target.parentElement.id.split("-")[0] + "Hand";
            move.piece = dropPiece;
        }

        let stage = candidates.length ? "choose" : "touch";
        console.log(move);

        this.setState({position, candidates, stage});
        this.setGameState({move})
    }

    setCandidates = this.localSetCandidates.bind(this);

    localPreviewMove (event) {
        
        if (!event.target.classList.contains("candidate")) return this.setCandidates(event);

        let move = this.props.move;
        move.target = event.target.id;

        let stage = "consider";
        
        this.setState({stage});
        this.setGameState({move});
    }

    previewMove = this.localPreviewMove.bind(this);



    render () {
        console.log(this.state.position);
        return (
            this.state.position[11] ?
            (<div id="diagramContainer" onClick={this.props.canPlay ? this.state.stage === "touch" ? this.setCandidates : this.previewMove : null}>
                <PieceStand pieceStand={this.state.position.goteHand}/>
                <table className="shogiDiagram">
                    <PlaySpace {...this.state} move={this.props.move}/>
                </table>
                <PieceStand pieceStand={this.state.position.senteHand}/>
            </div>)
            :
            null
        );
    }
}

export {Board};