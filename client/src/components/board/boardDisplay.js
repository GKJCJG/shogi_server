import React from "react";
import CoordinateRow from "./coordinateRow";
import Rank from "./rank";

const BoardDisplay = (props) => {
    return (
    <div className = "board">
        <CoordinateRow/>
        {["一", "二", "三", "四", "五", "六", "七", "八", "九"].map((coord, index) => <Rank key={coord} {...props} coordSymbol={coord} vertCoord={index + 1}/>)}
    </div>
    )
}

export default BoardDisplay;