import React, {Component} from "react";
import API from "../../utils/api";
import Headline from "./headline";
import MakeMove from "./makeMove";
import OTBActions from "./OTBActions";
import "./actions.css";



const PreviousMove = (props) => {
    return <div onClick={props.showPrevious} className="clickSpan">Previous move »</div>;
}

class Actions extends Component { 

    constructor (props) {
        super(props)

        this.restoreDefaults = props.restoreDefaults;
    }

    otherPlayer () {
        return this.props.viewer === "sente" ? "gote" : "sente";
    }

    localOfferDraw () {
        let alert = this.otherPlayer();
        API.OTBAction(this.props.access, {alert, action: {drawOffer: this.props.viewer}})
        .then(response => this.restoreDefaults());
    }

    offerDraw = this.localOfferDraw.bind(this);

    localAcceptDraw () {
        let alert = this.otherPlayer();
        API.OTBAction(this.props.access, {alert, action: {drawOffer: "accepted"}})
        .then(response => this.restoreDefaults());
    }

    acceptDraw = this.localAcceptDraw.bind(this);

    localRefuseDraw () {
        let alert = this.otherPlayer();
        API.OTBAction(this.props.access, {alert, action: {drawOffer: ""}})
        .then(response => this.restoreDefaults());
    }

    refuseDraw = this.localRefuseDraw.bind(this);

    localResignGame () {
        let winner = this.otherPlayer();
        API.OTBAction(this.props.access, {alert: winner, action: {resigned: this.props.viewer, winner}})
        .then (response => this.restoreDefaults());
    }

    resignGame = this.localResignGame.bind(this);

    sendMove(doesPromote) {
        const alert = this.otherPlayer();
        const { origin, target, piece } = this.props.move;
        const move = piece ?
            piece + "*" + target
            : (origin + "-" + target) + (doesPromote ? "+" : "");

        API.makeMove(this.props.access, {alert, move})
            .then(response => this.restoreDefaults());
    }

    sendMoveNoPromote = this.sendMove.bind(this, false);
    sendMoveWithPromote = this.sendMove.bind(this, true);

    localShowPrevious() {
        if (this.props.showPrevious) return this.props.setGameState({showPrevious: false});
        this.props.setGameState({showPrevious: true});
    }

    showPrevious = this.localShowPrevious.bind(this);

    render () {
        const OTBProps = {
            acceptDraw: this.acceptDraw,
            offerDraw: this.offerDraw,
            refuseDraw: this.refuseDraw,
            resignGame: this.resignGame,
        }

        const makeMoveProps = {
            sendMoveNP: this.sendMoveNoPromote,
            sendMoveWP: this.sendMoveWithPromote
        }

        return (
        <div>
            <Headline {...this.props}/>
            <MakeMove {...this.props} {...makeMoveProps}/>
            <OTBActions {...this.props} {...OTBProps}/>
            <PreviousMove showPrevious={this.showPrevious}/>
        </div>
        )
    }
}
export {Actions};