import React from "react";

const ChatBox = (props) => <div id="chatBox">{props.messages.reverse().map((e, i) => <p key={"message"+i}>{`#${e.moveNumber} ${e.author}: ${e.message}`}</p>)}</div>;

export default ChatBox;