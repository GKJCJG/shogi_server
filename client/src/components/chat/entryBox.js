import React, {Component} from "react";
import API from "../../utils/api";

class EntryBox extends Component {

    constructor (props) {
        super(props);

        this.state = {
            currentMessage: "",
            errorMessage: ""
        };

        this.addMessage = props.addMessage;
    }

    onChange = (event) => {
        const state = this.state
        state[event.target.name] = event.target.value;
        this.setState(state);
    };
    
    localSubmitMessage (event) {
        event.preventDefault();
        let message = this.state.currentMessage;
        if (message) {
            message = {moveNumber: this.props.moveNumber, author: this.props.playerNick, message}
            this.setState({currentMessage: "", errorMessage:""});
            API.addMessage(this.props.access, {message})
            .then(dbMessage => {
                this.addMessage(message);
            })
            .catch(err => {
                this.setState({errorMessage: "Oops, that message didn't send correctly!"})
            });
            
        }
    }

    submitMessage = this.localSubmitMessage.bind(this);

    render() {
        const divClass = this.state.currentMessage ? "clickSpan" : "idleSpan";
        return (
        <div>
            {this.state.errorMessage ? <div>{this.state.errorMessage}</div> : null}
            <form>
                <textarea id="textEntry" name="currentMessage" onChange={this.onChange} value={this.state.currentMessage}/>
                <div className = {divClass} onClick={this.submitMessage}>Add Message »</div>
            </form>
        </div>
    )}
}

export default EntryBox;