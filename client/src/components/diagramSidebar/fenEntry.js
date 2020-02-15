import React from "react";

const FenEntry = (props) => {
    return (
        <div className="textEntry">
            <textarea onChange={props.onChange} value={props.value}></textarea>
            <div className="resetButtons">
                <button onClick={props.emptyBoard}>Empty Board</button>
                <button onClick={props.initialPosition}>Initial Position</button>
            </div>
        </div>
    );
}

export default FenEntry;