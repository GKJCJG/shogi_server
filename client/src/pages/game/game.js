import React, { Component } from "react";
import {Board, Actions, Chat} from "../../components/gameIndex";
import API from "../../utils/api";
import gameLogic from "../../utils/game";

class Game extends Component {

    getGame () {
        API.getGame(this.props.location.id)
        .then(response => this.setState(response.data));
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