import React from "react";

const ChessBoard = (props) => {
    const board = [];
    for (let i = 8; i > 0; i--) {
        const rank = [];
        for (let j = 1; j < 9; j++) {
            rank.push(props.position["" + j + i]);
        }
        board.push(rank);
    }

    return (
    <div id = "diagramContainer">
        <table className = "chessdiagram">
            <tbody>
                {board.map((e, i) => <ChessRow key = {"row" + (8 - i)} rowNumber = {8 - i} row = {e}/>)}
                {<tr>{["", "a", "b", "c", "d", "e", "f", "g", "h"].map((e, i) => <th key = {"label" + i}>{e}</th>)}</tr>}
            </tbody>
        </table>
    </div>
    )
}

function ChessRow (props) {
    return (
        <tr>
            <th className = "left">{props.rowNumber}</th>
            {props.row.map((e, i) => <td id = {"" + (i + 1) + (props.rowNumber)} key = {"" + props.rowNumber + i}>{e}</td>)}
        </tr>
    )
}

export {ChessBoard};