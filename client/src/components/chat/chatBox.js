import React from "react";

const ChatBox = (props) => {
    let messages = [];
    for (let i = props.messages.lengt - 1; i >= 0; i--) {
        messages[props.messages.length - 1 - i] = props.messages[i];
    }
    return <div id="chatBox">{messages.map((e, i) => <p key={"message"+i}>{`#${e.moveNumber} ${e.author}: ${e.message}`}</p>)}</div>
};

export default ChatBox;