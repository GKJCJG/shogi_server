import React from "react";

const PieceStand = (props) => {
    const {class: owner, occupants} = props.pieceStand;
    return (
    <div id={owner} className={owner + " hand"}>
        {occupants
            .map((piece, index) => piece.number > 0 ?
            (<div key={owner+"piece"+index} className="pieceIcon" id={owner+"-"+piece.name}>
                {piece.symbol}{piece.number > 1 ? <span className="handMult" id={owner+"-"+piece.name+"-multiplier"}>{piece.number}</span> : null}
            </div>)
            :
            null)}
    </div>
    )
}

export default PieceStand;