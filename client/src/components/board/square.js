import React, {Component} from "react";

class Square extends Component {

    constructor (props) {
        super (props);
        const {position, vertCoord, horCoord, move, lastMove, showPrevious} = props.position;
        const thisSquare = position[horCoord+vertCoord];

        let classes = ["square"], occupantClass;
        classes = classes.concat(thisSquare.class);
        if (showPrevious && (horCoord + vertCoord) === lastMove) classes.push("previous");
        if (["と", "杏", "圭", "全", "馬", "竜"].includes(thisSquare.occupant)) classes.push("promoted");
        if ((horCoord + vertCoord) === move.origin) classes.push("origin");
        if (classes.includes("gote")) occupantClass = "gote";
        this.className = classes.filter(e => e !== "gote").join(" ");

        if (thisSquare.occupant) {
            occupantClass = occupantClass || "sente";
            this.occupant = (<div className = {"piece " + occupantClass}>{thisSquare.occupant}</div>);
        } else {
            this.occupant = null;
        }

        this.key = "square" + horCoord + vertCoord;

        this.id = horCoord + vertCoord;

        if ((horCoord + vertCoord) === move.target) {
            
        }
    }

    isPromoted (symbol) {
        return ["と", "杏", "圭", "全", "馬", "竜"].includes(symbol);
    }

    computeClass () {
        const {position, vertCoord, horCoord} = this.props;
        return "square " + position[horCoord+vertCoord].class.join(" ");
    }

    computeOccupant () {
        const {position, vertCoord, horCoord} = this.props;
    }
}