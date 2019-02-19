import React, {Component} from "react";
import API from "../../utils/api";

class Actions extends Component { 

    constructor (props) {
        super(props)

        this.reRenderGame = props.reRenderGame;
    }

    offerDraw () {
        API.OTBAction(this.props.access, {drawOffer: this.props.viewer})
        .then(response => this.reRenderGame());
    }

    acceptDraw () {
        API.OTBAction(this.props.access, {drawOffer: "accepted"})
        .then(response => this.reRenderGame());
    }

    refuseDraw () {
        API.OTBAction(this.props.access, {drawOffer: ""})
        .then(response => this.reRenderGame());
    }

    resignGame () {
        let winner = this.props.viewer === "sente" ? "gote" : "sente"
        API.OTBAction(this.props.access, {resigned: this.props.viewer, winner})
        .then (response => this.reRenderGame());
    }

    render () {
        if (this.props.canPlay) {
            if (this.props.APIready) {
                return <div className = "clickSpan" onClick={() => this.initiateSend("move")}>Make this move!</div>;
            } else {
                return <div>Please choose your move</div>;
            }
        } else {
            return <div>You're waiting for your opponent to play!</div>;
        }
    }
}
export {Actions};