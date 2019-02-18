import React, { Component } from "react";
import {Board, Actions, Chat} from "../../components/gameIndex";
import API from "../../utils/api";
import gameLogic from "../../utils/game";

class Game extends Component {

    state={
        legalMoves: [],
        position: {}
    };

    componentDidMount () {
        this.getGame();
    }

    getGame () {
        API.getGame(this.props.match.params.id)
        .then(response => {
            this.readGame(response.data.handicap, response.data.moves);
            
            this.setInitialPosition();
        });
    }

    readGame (handicap, moves) {
        this.gameBoard = new gameLogic(handicap);
        this.gameBoard.initialize();
        this.gameBoard.readMoves(moves);
    }

    setInitialPosition () {
        const position = this.gameBoard.render();
        this.setState(position);
        console.log(position);
    }

    render () {
        return (
            <div className="container">
                <Board/>
                <Actions/>
                <Chat/>
            </div>
        );
    }

}

export {Game};