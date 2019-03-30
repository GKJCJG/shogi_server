import React from "react";
import CoordinateRow from "./coordinateRow";
import Rank from "./rank";

const BoardDisplay = (props) => {
    return (
    <div className = "board">
        <CoordinateRow/>
        {["一", "二", "三", "四", "五", "六", "七", "八", "九"].map((coord, index) => <Rank key = {coord} {...props} coordSymbol = {coord} vertCoord = {index+1}/>)}
    </div>
    )
}

// const BoardDisplay = (props) => {
//     let {origin, target, piece, motum} = props.move;

//     const isPromoted = (symbol) => ["と", "杏", "圭", "全", "馬", "竜"].includes(symbol);
//     const computeTd = (i, j) => <td key={tdKey(i, j)}
//         id={tdId(i, j)}
//         className={tdClass(i, j)}
//         style={tdStyle(i, j)}>
//         {tdText(i, j)}
//         {tdSuperPosition(i, j)}
//         </td>
//     const tdClass = (i, j) => "boardSquare " + props.position[""+(10-j)+i].class.join(" ");
//     const tdText = (i, j) => props.position[""+(10-j)+i].occupant;
//     const tdKey = (i, j) => "square"+(10-j)+i;
//     const tdId = (i, j) => ""+(10-j)+i;
//     const tdStyle = (i, j) => {
//         let style = {}
//         if (props.showPrevious && "" + (10-j) + i === props.position.lastMove) {
//             style.backgroundColor = "rgba(87, 166, 219, 0.5)";
//         }
//         if (target) {
//             if ("" + (10-j) + i === origin) {
//                 style.opacity= 0.3;
//             } else if ("" + (10-j) + i === target) {
//                 style.position = "relative";
//             }
//         }
//         if (isPromoted(props.position[""+(10-j)+i].occupant)) style.color = "red";
//         return style;
//     }
//     const tdSuperPosition = (i, j) => {
//         if (target && "" + (10-j) + i === target) {
//             let superPosition
//             const spText = piece ? props.position.senteHand.occupants.filter(e => e.name === piece)[0].symbol : props.position[origin].occupant;
//             const spanClass = props.position[target].class.includes("gote") || props;
//             const spStyle = isPromoted(motum) ? {color: "red"} : { color: "#444"};
    
//             superPosition = (
//                 <div style = {spStyle} className = {spanClass+" superPose"}>{spText}</div>
//             );
//             return superPosition;
//         }
        
//         return null;
//     }

//     const computeFileNumber = (i) => <td key={fnKey(i)} id={fnKey(i)} className={fnClass("right")}>{fnText(i)}</td>;
//     const fnKey = (i) => "rank" + i;
//     const fnText = (i) => ["一", "二", "三", "四", "五", "六", "七", "八", "九"][i-1];
//     const fnClass = (base) => {
//         return (base + (props.viewer === "gote" ? " gote" : ""))
//     };
    

//     const renderRows = () => {
//         const output = [];
//         for(let i = 0; i < 10; i++) {
//             const cells = []
//             if (i===0) {
//                 for(let j = 1; j < 10; j++) {
//                     cells.push(<td key={"file"+j} id={"file"+j} className={fnClass("top")}>{10-j}</td>)
//                 }
//             } else {
//                 for(let j = 1; j < 11; j++) {
//                     if (j < 10) cells.push(computeTd(i, j));
//                     if (j === 10) cells.push(computeFileNumber(i));
//                 }
//             }
//             output.push(<tr key={"row" + i}>{cells}</tr>);
//         }

//         return output;
//     }

//     return (
//         <tbody>
//             {renderRows()}
//         </tbody>
//     )
// };

export default BoardDisplay;