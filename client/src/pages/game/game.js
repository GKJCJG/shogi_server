import React, { Component } from "react";
import {Board, Actions, Chat} from "../../components/gameIndex";
import "./game.css";


class Game extends Component {

    constructor () {
        super()
        this.state = {
            canPlay: false,
            canRespond: false,
            moveSent: false,
            opponentNick: "",
            playerNick: "",
            checkMate: false,
            inCheck: false,
            drawOffer: false,
            resigned: false,
            viewer: "",
            lastMove: "",
            winner: "",
            move: {},
            previousMessages: [],
            moveNumber: 0,
            showPrevious: false,
            reportRequested: false
        }
    }

    passSetState = this.setState.bind(this);

    localRestoreDefaults () {
        this.setState({
            canPlay: false,
            canRespond: false,
            moveSent: false,
            opponentNick: "",
            playerNick: "",
            checkMate: false,
            inCheck: false,
            drawOffer: false,
            resigned: false,
            viewer: "",
            winner: "",
            move: {},
            previousMessages: [],
            moveNumber: 0,
            showPrevious: false,
            // must be true because when defaults are reset, we must get new info from the board's API call.
            reportRequested: true,
        })
    }

    restoreDefaults = this.localRestoreDefaults.bind(this);

    render () {
        const boardProps = {
            access:this.props.match.params.id,
            moveSent: this.state.moveSent,
            canPlay: this.state.canPlay,
            setGameState: this.passSetState,
            restoreDefaults: this.restoreDefaults,
            reportRequested: this.state.reportRequested,
            move: this.state.move,
            viewer: this.state.viewer,
            showPrevious: this.state.showPrevious
        };
        const actionProps = {
            access: this.props.match.params.id,
            setGameState: this.passSetState,
            restoreDefaults: this.restoreDefaults,
            showPrevious: this.state.showPrevious
        };
        const chatProps = {
            previousMessages: this.state.previousMessages,
            access: this.props.match.params.id,
            playerNick: this.state.playerNick,
            moveNumber: this.state.moveNumber
        }
        return (
            <div className="gameContainer">
                <Board {...boardProps}/>
                <div className = "nonBoard">
                    <Actions {...actionProps} {...this.state}/>
                    <Chat {...chatProps}/>
                </div>
            </div>
        );
    }

}

export {Game};