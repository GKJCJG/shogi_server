import React from "react";

const CoordinateRow = () => (
    <div className="top">
        {[9, 8, 7, 6, 5, 4, 3, 2, 1].map(coord => <div className="coordinate" key={"top" + coord}>{coord}</div> )}
    </div>
)

export default CoordinateRow;