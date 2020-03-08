import React from "react";

const PieceStand = (props) => {
    const {class: owner, occupants} = props.pieceStand;
    const occupantsInDisplayOrder = owner === "sente" ? occupants : [...occupants].reverse();
    return (
    <div id={`${owner}-hand`} className="hand">
        {occupantsInDisplayOrder
            .map((piece, index) => piece.number > 0 ?
            (<div key={owner+"piece"+index} className={`${owner} pieceIcon`} id={owner+"-"+piece.name} draggable>
                {piece.symbol}{piece.number > 1 ? <span className="handMult" id={owner+"-"+piece.name+"-multiplier"}>{piece.number}</span> : null}
            </div>)
            :
            null)}
    </div>
    )
}

export default PieceStand;