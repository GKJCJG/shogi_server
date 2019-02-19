import React, { Component } from "react";
import {Board, Actions, Chat} from "../../components/gameIndex";
import "./game.css";



class Game extends Component {

    constructor () {
        super()
        this.state = {
            APIready: false,
            canPlay: false,
            canRespond: false,
            moveSent: false,
            opponentNick: "",
            checkMate: false,
            inCheck: false,
            drawOffer: false,
            resigned: false,
            viewer: "",
            lastMove: "",
            winner: "",
            reportRequested: false
        }
    }

    passSetState = this.setState.bind(this);

    localRestoreDefaults () {
        this.setState({
            APIready: false,
            canPlay: false,
            canRespond: false,
            moveSent: false,
            opponentNick: "",
            checkMate: false,
            inCheck: false,
            drawOffer: false,
            resigned: false,
            viewer: "",
            lastMove: "",
            winner: "",
            reportRequested: true
        })
    }

    restoreDefaults = this.localRestoreDefaults.bind(this);

    localInitiateSend() {
        this.setState({moveSent: true});
    }

    initiateSend = this.localInitiateSend.bind(this);

    render () {
        const boardProps = {
            access:this.props.match.params.id,
            moveSent: this.state.moveSent,
            canPlay: this.state.canPlay,
            setGameState: this.passSetState,
            restoreDefaults: this.restoreDefaults,
            reportRequested: this.state.reportRequested
        };
        const actionProps = {
            access:this.props.match.params.id,
            initiateSend: this.initiateSend,
            restoreDefaults: this.restoreDefaults
        };

        return (
            <div className="gameContainer">
                <Board {...boardProps}/>
                <Actions {...actionProps} {...this.state}/>
                <Chat/>
            </div>
        );
    }

}

export {Game};