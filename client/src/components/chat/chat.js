import React, {Component} from "react";
import EntryBox from "./entryBox";
import ChatBox from "./chatBox";
import "./chat.css";


class Chat extends Component {

    constructor (props) {
        super(props);

        this.state = {
            previousMessages: []
        }
    }

    componentDidUpdate () {
        if (this.props.previousMessages.length > this.state.previousMessages.length) {
            this.setState({previousMessages: this.props.previousMessages})
        }
    }

    localAddMessage (message) {
        const previousMessages = this.state.previousMessages;
        previousMessages.push(message);
        this.setState({previousMessages});
    }

    addMessage = this.localAddMessage.bind(this);

    render () {
        return <div id="chatArea">
            <div id="chatLabel">Chat</div>
            <EntryBox addMessage={this.addMessage} {...this.props}/>
            <ChatBox messages={this.state.previousMessages}/>
        </div>;
    }
}

export {Chat};