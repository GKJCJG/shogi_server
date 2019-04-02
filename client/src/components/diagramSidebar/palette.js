import React from "react";
import {letterDictionary} from "./../../utils/dictionaries";
import "./palette.css";

const symbolPairList = [];
for (let key in letterDictionary) {
    if (letterDictionary.hasOwnProperty(key)) symbolPairList.push({letter: key, symbol:letterDictionary[key].symbol});
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