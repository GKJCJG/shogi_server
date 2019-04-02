import React from "react";
import {symbolDictionary} from "./../../utils/diagramClasses";
import "./palette.css";

const symbolPairList = [];
for (let key in symbolDictionary) {
    if (symbolDictionary.hasOwnProperty(key)) symbolPairList.push({letter: key, symbol:symbolDictionary[key]});
}

const Palette = (props) => {
    
    return (
    <div id="palette" onClick={props.setActive}>
    {symbolPairList.map((e, i) => (
        <div className={"fenholder" + (props.onPalette.symbol === e.letter ? " active" : "")} key={"fenHolder_" + i}>
            <div className="fenLetter">{e.letter}</div>
            <div className="fenSymbol">{e.symbol}</div>
        </div>
    ))}
    </div>
    );
}

export default Palette;