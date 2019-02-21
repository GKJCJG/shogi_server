import React from "react";

const MakeMove = (props) => {
    const {target, isPromotable} = props.move;
    const divClass = target ? "clickSpan" : "idleSpan";
    const divClick = target ? props.sendMoveNP : null;

    if (isPromotable) return (
        <div>
            <div className={divClass} onClick={props.sendMoveWP}>Make this move with promotion »</div>
            <div className={divClass} onClick={props.sendMoveNP}>Make this move without promotion »</div>
        </div>
    )
    
    return <div className={divClass} onClick={divClick}>Make this move »</div>
}

export default MakeMove;