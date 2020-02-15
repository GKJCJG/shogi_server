import React, {Component} from "react";
import {ChessBoard} from "./../../components/chessBoard/chessBoard";
import {ChessFEN} from "./../../utils/chessTranslators";
import Palette from "./../../components/diagramSidebar/palette";
import FenEntry from "./../../components/diagramSidebar/fenEntry";
import "./chessDiagram.css";

const Directions = () => (
    <div id="directions">
        Using this diagram generator, you can create both images and SFEN-like strings that represent board positions. You may create your diagram by clicking on the icons below and then placing each piece on the board, or you can edit the SFEN string below. Or do a bit of both - both the board and the string will update with each change.
    </div>
)

class ChessDiagram extends Component {

    constructor () {
        super();

        this.state = {
            string: "8/8/8/8/8/8/8/8",
            position: new ChessFEN("8/8/8/8/8/8/8/8").position,
            onPalette: {occupant: "", symbol: ""}
        };
    }

    handleBoardClick (event) {
        this.handleSquareClick(event);
    }

    passHandleBoardClick = this.handleBoardClick.bind(this);

    handleSquareClick (event) {
        let position = this.state.position;
        let id = event.target.id || event.target.parentElement.id;
        if (event.altKey) {
            position[id] = {occupant: null, class: [null], symbol: null};
        } else if (event.ctrlKey) {
            position[id] = {occupant: this.state.onPalette.occupant, class: ["gote"], symbol: this.state.onPalette.symbol};
        } else {
            position[id] = {occupant: this.state.onPalette.occupant, class: ["sente"], symbol: this.state.onPalette.symbol};
        }

        this.setState({position, string: new ChessFEN(position).FENString});
    }

    handleType (event) {
        this.setState({string: event.target.value, position: new ChessFEN(event.target.value).position});
    }

    passHandleType = this.handleType.bind(this);

    setActive (event) {
        let newPalette = {
            symbol: event.target.parentElement.textContent[0],
            occupant: event.target.parentElement.textContent[1]
        };

        this.setState({onPalette: newPalette});
    }

    passSetActive = this.setActive.bind(this);

    render () {
        return (
            <div className="gameContainer">
                <ChessBoard position={this.state.position} handleBoardClick={this.passHandleBoardClick}/>
                <div className = "nonBoard">
                    <Directions />
                    <FenEntry onChange = {this.passHandleType} value = {this.state.string}/>
                    <Palette setActive={this.passSetActive} onPalette = {this.state.onPalette}/>
                </div>
            </div>
        );
    }

}

export {ChessDiagram};