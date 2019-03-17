import React from "react";

const FenEntry = (props) => {
    return <textarea onChange={props.onChange} value = {props.value}></textarea>;
}

export default FenEntry;