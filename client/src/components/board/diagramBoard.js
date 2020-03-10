import React from "react";
import "./board.css";
import PieceStand from "./pieceStand";
import BoardDisplay from "./boardDisplay";

const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
}

const DiagramBoard = (props) => {
    return (
            <div id="diagramContainer" onContextMenu={props.handleBoardClick} onClick={props.handleBoardClick} onDragStart={props.handleDragStart} onDragOver={handleDrag} onDrop={props.handleDrop}>
                <PieceStand pieceStand={props.position.goteHand} />
                    <BoardDisplay {...props} /> 
                <PieceStand pieceStand={props.position.senteHand} />
            </div>
    );
}


export default DiagramBoard;