import React, { Component } from "react";
import {Board, Actions, Chat} from "../../components/gameIndex";



class Game extends Component {

    constructor () {
        super()
        this.state = {
            APIready: false,
            canPlay: false,
            moveSent: false,
            opponentNick: "",
            checkMate: false,
            inCheck: false,
            drawOffer: false,
            resigned: false,
            viewer: "",
        }
    }

    passSetState = this.setState.bind(this);

    passRender = this.render.bind(this);

    render () {
        console.log(this.state);
        const boardProps = {
            access:this.props.match.params.id,
            moveSent: this.state.moveSent,
            canPlay: this.state.canPlay,
            setGameState: this.passSetState
        };
        const actionProps = {
            access:this.props.match.params.id,
            initiateSend: this.initiateSend,
            reRenderGame: this.passRender
        };

        return (
            <div className="container">
                <Board {...boardProps}/>
                <Actions {...actionProps} {...this.state}/>
                <Chat/>
            </div>
        );
    }

}

export {Game};