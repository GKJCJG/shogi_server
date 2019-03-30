import React from "react";

const ChatBox = (props) => <div id="chatBox">{props.messages.sort((a, b) => a.moveNumber - b.moveNumber).map((e, i) => <p key={"message"+i}>{`#${e.moveNumber} ${e.author}: ${e.message}`}</p>)}</div>;

export default ChatBox;