import React from "react";
import "./palette.css";


const Palette = (props) => {
    return (
    <div id="directions" onClick={props.setActive}>
    <div className="fenholder">
        <div className="fenLetter">p</div>
        <div className="fenSymbol">歩</div>
    </div>
    <div className="fenholder">
        <div className="fenLetter">t</div>
        <div className="fenSymbol">と</div>
    </div>
    <div className="fenholder">
        <div className="fenLetter">l</div>
        <div className="fenSymbol">香</div>
    </div>
    <div className="fenholder">
        <div className="fenLetter">x</div>
        <div className="fenSymbol">杏</div>
    </div>
    <div className="fenholder">
        <div className="fenLetter">n</div>
        <div className="fenSymbol">桂</div>
    </div>
    <div className="fenholder">
        <div className="fenLetter">h</div>
        <div className="fenSymbol">圭</div>
    </div>
    <div className="fenholder">
        <div className="fenLetter">s</div>
        <div className="fenSymbol">銀</div>
    </div>
    <div className="fenholder">
        <div className="fenLetter">q</div>
        <div className="fenSymbol">全</div>
    </div>
    <div className="fenholder">
        <div className="fenLetter">g</div>
        <div className="fenSymbol">金</div>
    </div>
    <div className="fenholder">
        <div className="fenLetter">b</div>
        <div className="fenSymbol">角</div>
    </div>
    <div className="fenholder">
        <div className="fenLetter">m</div>
        <div className="fenSymbol">馬</div>
    </div>
    <div className="fenholder">
        <div className="fenLetter">r</div>
        <div className="fenSymbol">飛</div>
    </div>
    <div className="fenholder">
        <div className="fenLetter">d</div>
        <div className="fenSymbol">竜</div>
    </div>
    <div className="fenholder">
        <div className="fenLetter">k</div>
        <div className="fenSymbol">玉</div>
    </div>
</div>
    );
}

export default Palette;