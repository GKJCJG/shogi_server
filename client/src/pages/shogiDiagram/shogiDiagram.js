import React, {Component} from "react";
import Board from "./../../components/board/diagramBoard";
import {FenString, DiagramPosition} from "./../../utils/diagramClasses";
import Palette from "./../../components/diagramSidebar/palette";
import FenEntry from "./../../components/diagramSidebar/fenEntry";
import "./diagram.css";

const Directions = () => (
    <div id="directions">
        Using this diagram generator, you can create both images and SFEN-like strings that represent board positions. You may create your diagram by clicking on the icons below and then placing each piece on the board, or you can edit the SFEN string below. Or do a bit of both - both the board and the string will update with each change.
    </div>
)

class ShogiDiagram extends Component {

    constructor () {
        super();

        this.state = {
            string: "9/9/9/9/9/9/9/9/9/0000000/0000000",
            position: new FenString("9/9/9/9/9/9/9/9/9/0000000/0000000").translateToObject(),
            onPalette: {occupant: "", symbol: ""}
        };
    }

    handleBoardClick (event) {
        if (event.target.id.search("sente") !== -1 || event.target.id.search("gote") !== -1) {
            this.handleHandClick(event);
        } else if (!isNaN(event.target.id)) {
            this.handleSquareClick(event);
        }
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

        this.setState({position, string: new DiagramPosition(position).translateToString()});
    }

    handleHandClick (event) {
            const pieceOrder = ["歩", "香", "桂", "銀", "金", "角", "飛"];
            let position = this.state.position;
            const owner = event.target.id.search("-") === -1 ? event.target.id : event.target.id.substring(0, event.target.id.search("-"));
            let targetArray = position[owner + "Hand"].occupants;
            const index = pieceOrder.indexOf(this.state.onPalette.occupant);
            if (index !== -1) {
                if (event.altKey) {
                    targetArray[index].number--;
                    if (targetArray[index].number < 0) targetArray[index].number = 0;
                } else {
                    targetArray[index].number++;
                }
            }    

            this.setState({position, string: new DiagramPosition(position).translateToString()});
    }

    handleType (event) {
        this.setState({string: event.target.value, position: new FenString(event.target.value).translateToObject()});
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
                <Board position={this.state.position} handleBoardClick={this.passHandleBoardClick}/>
                <div className = "nonBoard">
                    <Directions />
                    <FenEntry onChange = {this.passHandleType} value = {this.state.string}/>
                    <Palette setActive={this.passSetActive} onPalette = {this.state.onPalette}/>
                </div>
            </div>
        );
    }

}

export {ShogiDiagram};