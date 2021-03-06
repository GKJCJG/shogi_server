import React from "react";

const ChatBox = (props) => {
    let messages = props.messages.slice();
    return <div id="chatBox">{messages.reverse().map((e, i) => <p key={"message"+i}>{`#${e.moveNumber} ${e.author}: ${e.message}`}</p>)}</div>
};

export default ChatBox;