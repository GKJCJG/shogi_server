import React, {Component} from "react";
import Board from "./../../components/board/diagramBoard";
import gameLogic from "./../../utils/shogiBoard";

class FenString {
    constructor (string) {
        this.FEN = string;
        this.FENArray = string.split("/");
    }

    translateToObject() {
        const rowPartial = this.translateRows();
        const handPartials = this.translateHands();

        return Object.assign(rowPartial, handPartials);
    }

    translateRows() {
        let rows = {}
        for (let i=0; i<9; i++) {
            const singleRow = this.objectifyRow(this.FENArray[i]);
            Object.assign(rows, singleRow);
        }
        return rows;
    }

    objectifyRow(rowString) {
        let output = {};
        for (let i = 0; i < rowString.length; i++) {
            if (isNaN(rowString[i])) {
                handleSymbol(rowString[i]);
            } else {
                handleNumber(rowString[i])
            }
        }
        
        function handleSymbol(symbol) {
            
        }
    
        function handleNumber(number) {

        }
    }

    
}

class ShogiDiagram extends Component {

    constructor () {
        super();

        this.state = this.translateFEN("9/9/9/9/9/9/9/9/9/0000000/0000000")
    }

    translateFEN (fenString) {
        const fenArray = fenString.split("/");
        let positionObject = {};

        
    }

    render () {
        return (
            <div className="gameContainer">
                <Board {...boardProps}/>
                <div className = "nonBoard">
                    <FenEntry {...actionProps} {...this.state}/>
                    <Palette setActive={this.passSetActive}/>
                </div>
            </div>
        );
    }

}

export {ShogiDiagram};