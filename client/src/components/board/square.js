import React from "react";
import {nameDictionary} from "../../utils/dictionaries"

const Square = (props) => {
    const {position, vertCoord, horCoord, showPrevious} = props;
    const move = props.move || {}; // Necessary to separate it from rest of declarations because following statements look inside it, so cannot be undefined.
    const thisSquare = position[horCoord+vertCoord];
    let className, occupant, id, superPosition;

    let classes = ["square"], occupantClass = "";
    classes = classes.concat(thisSquare.class);
    if (showPrevious && (horCoord + vertCoord) === position.lastMove) classes.push("previous");
    if ((horCoord + vertCoord) === move.origin) classes.push("origin");
    if (classes.includes("gote")) occupantClass = "gote";
    className = classes.filter(e => e !== "gote").join(" ");

    if (thisSquare.occupant) {
        occupantClass = occupantClass || "sente";
        if (["と", "杏", "圭", "全", "馬", "竜"].includes(thisSquare.occupant)) occupantClass += " promoted";
        occupant = (<div className = {"piece " + occupantClass}>{thisSquare.occupant}</div>);
    } else {
        occupant = null;
    }

    id = horCoord + vertCoord;

    if ((horCoord + vertCoord) === move.target) {
        const spText = move.piece ? nameDictionary[move.piece].symbol : position[move.origin].occupant;
        let spClass = position[move.origin].class.includes("gote") ? "gote" : "sente";
        if (["と", "杏", "圭", "全", "馬", "竜"].includes(spText)) spClass += " promoted";
        superPosition = (<div className = {"superPose " + spClass}>{spText}</div>);
    } else {
        superPosition = null;
    }

    return (
        <div className = {className} id = {id}>{occupant}{superPosition}</div>
    );
};

export default Square;