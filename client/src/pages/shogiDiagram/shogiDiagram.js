import React, {Component} from "react";
import Board from "./../../components/board/diagramBoard";
import {FenString, ShogiPosition} from "./../../utils/diagramClasses";
import Palette from "./../../components/diagramSidebar/palette";
import FenEntry from "./../../components/diagramSidebar/fenEntry";
import "./diagram.css";


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
        if (isNaN(event.target.id)) {
            this.handleHandClick(event);
        } else {
            this.handleSquareClick(event);
        }
    }

    passHandleBoardClick = this.handleBoardClick.bind(this);

    handleSquareClick (event) {
        let position = this.state.position;
        if (event.altKey) {
            position[event.target.id] = {occupant: null, class: [null], symbol: null};
        } else if (event.ctrlKey) {
            position[event.target.id] = {occupant: this.state.onPalette.occupant, class: ["gote"], symbol: this.state.onPalette.symbol};
        } else {
            position[event.target.id] = {occupant: this.state.onPalette.occupant, class: ["sente"], symbol: this.state.onPalette.symbol};
        }

        this.setState({position, string: new ShogiPosition(position).translateToString()});
    }

    handleHandClick (event) {
        if (event.target.id !== "diagramContainer" && event.target.id.slice(0, -1) !== "rank" && event.target.id.slice(0, -1) !== "file") {
            console.log(event.target.id);
            const pieceOrder = ["歩", "香", "桂", "銀", "金", "角", "飛"];
            let position = this.state.position;
            let targetArray = position[event.target.id + "Hand"].occupants;
            const index = pieceOrder.indexOf(this.state.onPalette.occupant);
            if (event.altKey) {
                targetArray[index].number--;
                if (targetArray[index].number < 0) targetArray[index].number = 0;
            } else {
                targetArray[index].number++;
            }

            this.setState({position, string: new ShogiPosition(position).translateToString()});
        }
    }

    handleType (event) {
        console.log(event.target.value);

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
                    <FenEntry onChange = {this.passHandleType} value = {this.state.string}/>
                    <Palette setActive={this.passSetActive}/>
                </div>
            </div>
        );
    }

}

export {ShogiDiagram};