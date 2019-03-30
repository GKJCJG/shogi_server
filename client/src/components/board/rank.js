import React from "react";
import Square from "./square.js"

const Rank = (props) => (
    <div className = "rank">
        {[9, 8, 7, 6, 5, 4, 3, 2, 1].map(coord => <Square {...props} horCoord={coord.toString()}/>)}
        <div className="coordinate right">{props.coordSymbol}</div>
    </div>
)

export default Rank;