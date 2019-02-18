import React, {Component} from "react";
import "./board.css";

const PieceStand = (props) => (
    <div id={props.id}>
        {props.occupants
            .map((piece, index) => piece[1] > 0 ?
            (<div key={props.id+"piece"+index}>
                {piece[0]}{piece[1] > 1 ? <span className="handMult">{piece[1]}</span> : null}
            </div>)
            :
            null)}
    </div>
)

class Board extends Component {

    renderRows() {
        const output = [];
        for(let i = 0; i < 10; i++) {
            const cells = []
            if (i===0) {
                for(let j = 1; j < 10; j++) {
                    cells.push(<td key={"file"+j} id={"file"+j} className="top">{10-j}</td>)
                }
            } else {
                for(let j = 1; j < 11; j++) {
                    if (j < 10) cells.push(<td key={"square"+(10-j)+i} id={""+(10-j)+i} className={this.props.position[""+(10-j)+i].class}>{this.props.position[""+(10-j)+i].occupant}</td>);
                    if (j === 10) cells.push(<td key={"rank" + i} id={"rank"+i} className="right">{["一", "二", "三", "四", "五", "六", "七", "八", "九"][i-1]}</td>);
                }
            }
            output.push(<tr key={"row" + i}>{cells}</tr>);
        }

        return output;
    }

    render () {
        return (
            this.props.position[11] ?
            (<div id="diagramContainer">
                <PieceStand id="gote" occupants={this.props.position.goteHand}/>
                <table className="shogiDiagram">
                    <tbody>
                        {this.renderRows()}
                    </tbody>
                </table>
                <PieceStand id="sente" occupants={this.props.position.senteHand}/>
            </div>)
            :
            null
        );
    }
}

export {Board};