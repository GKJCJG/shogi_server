import React from "react";

const BoardDisplay = (props) => {
    let superPosition;
    let {origin, target, piece} = props.move;

    if(target) {
        const spText = piece ? props.position.senteHand.occupants.filter(e => e.name === piece)[0].symbol : props.position[origin].occupant;
        const spanClass = props.position[target].class.includes("gote") || props.position[origin].class.includes("gote") ? "gote" : null;

        superPosition = (
            <div className = {spanClass+" superPose"}>{spText}</div>
        );
    }

    const computeTd = (i, j) => <td key={tdKey(i, j)}
        id={tdId(i, j)}
        className={tdClass(i, j)}
        style={tdStyle(i, j)}>
        {tdText(i, j)}
        {tdSuperPosition(i, j)}
        </td>
    const tdClass = (i, j) => "boardSquare " + props.position[""+(10-j)+i].class.join(" ");
    const tdText = (i, j) => props.position[""+(10-j)+i].occupant;
    const tdKey = (i, j) => "square"+(10-j)+i;
    const tdId = (i, j) => ""+(10-j)+i;
    const tdStyle = (i, j) => {
        if (target) {
            if ("" + (10-j) + i === origin) {
                return {opacity: 0.3};
            } else if ("" + (10-j) + i === target) {
                return {position: "relative"};
            }
        }    
        return null;
    }
    const tdSuperPosition = (i, j) => {
        if (target && "" + (10-j) + i === target) return superPosition;
        return null;
    }

    const computeFileNumber = (i) => <td key={fnKey(i)} id={fnKey(i)} className={fnClass("right")}>{fnText(i)}</td>;
    const fnKey = (i) => "rank" + i;
    const fnText = (i) => ["一", "二", "三", "四", "五", "六", "七", "八", "九"][i-1];
    const fnClass = (base) => {
        return (base + (props.viewer === "gote" ? " gote" : ""))
    };
    

    const renderRows = () => {
        const output = [];
        for(let i = 0; i < 10; i++) {
            const cells = []
            if (i===0) {
                for(let j = 1; j < 10; j++) {
                    cells.push(<td key={"file"+j} id={"file"+j} className={fnClass("top")}>{10-j}</td>)
                }
            } else {
                for(let j = 1; j < 11; j++) {
                    if (j < 10) cells.push(computeTd(i, j));
                    if (j === 10) cells.push(computeFileNumber(i));
                }
            }
            output.push(<tr key={"row" + i}>{cells}</tr>);
        }

        return output;
    }

    return (
        <tbody>
            {renderRows()}
        </tbody>
    )
};

export default BoardDisplay;