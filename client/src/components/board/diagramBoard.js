import React from "react";
import "./board.css";
import PieceStand from "./pieceStand";
import BoardDisplay from "./boardDisplay";

const DiagramBoard = (props) => { // TODO: Change the way squares handle moves so that we don't have to add a null move to the props for the board.
    return (
            <div id="diagramContainer" onClick={props.handleBoardClick}>
                <PieceStand pieceStand={props.position.goteHand} />
                    <BoardDisplay {...props} move={{}} /> 
                <PieceStand pieceStand={props.position.senteHand} />
            </div>
    );
}


export default DiagramBoard;