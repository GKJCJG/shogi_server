import React, {Component} from "react";
import Board from "./../../components/board/diagramBoard";
import gameLogic from "./../../utils/shogiBoard";

const symbolDictionary = {
    p: "歩",
    t:　"と",
    l:　"香",
    x: "杏",
    n: "桂",
    h: "圭",
    s: "銀",
    q: "全",
    g: "金",
    b: "角",
    m: "馬",
    r: "飛",
    d: "竜",
    k: ["玉", "王"]
};

class FenString extends String {
    constructor (string) {
        super(string);
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
        for (let i=9; i>0; i++) {
            const singleRow = this.translateRow(i);
            Object.assign(rows, singleRow);
        }
        return rows;
    }

    translateRow(rowNumber) {
        let output = {}, currentFile = 9, rowString = this.FENArray[rowNumber];
        for (let i = 0; i < rowString.length; i++) {
            if (isNaN(rowString[i])) {
                handleSymbol(rowString[i]);
                currentFile--;
            } else {
                handleNumber(parseInt(rowString[i]));
                currentFile -= rowString[i];
            }
        }
        return output;
        
        function handleSymbol(symbol) {

            let squareClass = /[A-Z]/.test(symbol) ? ["gote"] : ["sente"];
            let occupant = symbolDictionary[symbol.toLowerCase()]

            output["" + currentFile + rowNumber] = {class: squareClass, occupant};
                        
        }
    
        function handleNumber(emptySquareCount) {
            for (let i=0; i<emptySquareCount; i++) {
                let currentSquare = "" + (currentFile-i) + rowNumber;
                output[currentSquare] = {class: [null], occupant: null};
            }
        }
    }

    translateHands() {
        const senteHand = Object.assign(this.translateHand(this.fenArray[9]), {class: "sente"});
        const goteHand = Object.assign(this.translateHand(this.fenArray[10]), {class: "gote"});
        return {senteHand, goteHand};
    }

    translateHand(handString) {
        let handOccupants = [];
        const pieceOrder = ["歩", "香", "桂", "銀", "金", "角", "飛"];
        for (let i = 0; i < pieceOrder.length; i++) {
            handOccupants.push({symbol: pieceOrder[i], number: handString[i]});
        }
        return {occupants: handOccupants};
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