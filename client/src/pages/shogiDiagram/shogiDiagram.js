import React, {Component} from "react";
import Board from "./../../components/board/diagramBoard";
import {FenString, ShogiPosition} from "./../../utils/diagramClasses";


class ShogiDiagram extends Component {

    constructor () {
        super();

        this.state= {string: "9/9/9/9/9/9/9/9/9/0000000/0000000",
        position: new FenString("9/9/9/9/9/9/9/9/9/0000000/0000000").translateToObject()};
    }

    handleBoardClick () {

    }

    passHandleBoardClick = this.handleBoardClick.bind(this);

    render () {
        return (
            <div className="gameContainer">
                <Board position={this.state.position} handleBoardClick={this.passHandleBoardClick}/>
                <div className = "nonBoard">
                    {/* <FenEntry {...actionProps} {...this.state}/> */}
                    {/* <Palette setActive={this.passSetActive}/> */}
                </div>
            </div>
        );
    }

}

export {ShogiDiagram};