import React from "react";
import "./board.css";
import PieceStand from "./pieceStand";
import BoardDisplay from "./boardDisplay";

const DiagramBoard = (props) => {
    return (
            <div id="diagramContainer" onClick={props.handleBoardClick}>
                <PieceStand pieceStand={props.position.goteHand} />
                <table className="shogiDiagram">
                    <BoardDisplay {...props} />
                </table>
                <PieceStand pieceStand={props.position.senteHand} />
            </div>
    );
}


export { DiagramBoard };