import React, { Component } from "react";
import {Board, Actions, Chat} from "../../components/gameIndex";



class Game extends Component {

    constructor () {
        super()
        this.state = {
            APIready: false
        }
    }

    localActivateAPI (APIready) {
        this.setState({APIready});
    }

    activateAPI = this.localActivateAPI.bind(this);

    render () {
        return (
            <div className="container">
                <Board access={this.props.match.params.id} activateAPI = {this.activateAPI}/>
                <Actions/>
                <Chat/>
            </div>
        );
    }

}

export {Game};