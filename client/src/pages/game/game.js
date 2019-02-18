import React, { Component } from "react";
import {Board, Actions, Chat} from "../../components/gameIndex";
import API from "../../utils/api";
import gameLogic from "../../utils/gameLogic";

class Game extends Component {
    constructor () {
        super()
        this.state = {
            position: {}
        } 
    }

    componentDidMount () {
        this.getGame();
    }

    getGame () {
        API.getGame(this.props.match.params.id)
        .then(response => {
            this.readGame(response.data.handicap, response.data.moves);
            
            this.setPosition();
        });
    }

    readGame (handicap, moves) {
        this.gameBoard = new gameLogic(handicap);
        this.gameBoard.initialize();
        this.gameBoard.readMoves(moves);
        console.log(this.gameBoard.getMoveList("sente"));
    }

    setPosition () {
        const position = this.gameBoard.render();
        this.setState({position});
    }

    render () {
        return (
            <div className="container">
                <Board position={this.state.position}/>
                <Actions/>
                <Chat/>
            </div>
        );
    }

}

export {Game};