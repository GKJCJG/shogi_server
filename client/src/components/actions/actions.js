import React, {Component} from "react";
import API from "../../utils/api";

const Headline = (props) => {
    if (props.drawOffer === "accepted") {
        return <div>This game has ended in a draw.</div>
    } else if (props.drawOffer && props.drawOffer !== props.viewer) {
        return <div>Your opponent has offered a draw. Please accept or decline.</div>
    } else if (props.drawOffer) {
        return <div>You have made a draw offer and are awaiting a response.</div>
    } else if (props.resigned) {
        return <div>This game has ended by resignation. {props.resigned === props.viewer ? props.opponentNick + " has" : "You have"} won.</div>
    } else if (props.winner) {
        return <div>This game has ended by checkmate. {props.resigned === props.viewer ? props.opponentNick + " has" : "You have"} won.</div>
    } else if (!props.canPlay) {
        return <div>You are waiting for your opponent to move.</div>
    } else if (props.APIready) {
        return <div>You may click elsewhere to make a different move.</div>
    } else {
        return <div>It is your turn to move. {props.inCheck ? "You are in check." : null}</div>
    }
}

const MakeMove = (props) => {
    let divClass = props.APIready ? "clickSpan" : "idleSpan";
    let divClick = props.APIready ? props.initiateSend : null;

    return <div className={divClass} onClick={divClick}>Make this move »</div>
}

const OTBActions = (props) => {
    const allowClick = (cb) => {
        if (props.canRespond || props.canPlay) return cb;
        return null;
    }
    const isActive = () => props.canPlay || props.canRespond ? "clickSpan" : "idleSpan"
    
    return <div><span className={isActive()} onClick={allowClick(props.resignGame)}>resign »</span> or <DrawOptions {...props} isActive={isActive}/></div>
}

const DrawOptions = (props) => {
    const opponent = props.viewer === "sente" ? "gote" : "sente";
    if (props.drawOffer === opponent) {
        return <span><span className={props.isActive()} onClick={props.acceptDraw}>accept draw »</span> or <span className={props.isActive()} onClick={props.refuseDraw}>refuse draw »</span></span>
    }
    return <span onClick={props.offerDraw} className={props.isActive()}>offer draw »</span>
}

const PreviousMove = () => {
    return <div>Previous Move</div>;
}

class Actions extends Component { 

    constructor (props) {
        super(props)

        this.restoreDefaults = props.restoreDefaults;
    }

    localOfferDraw () {
        console.log("offering draw!", this);
        API.OTBAction(this.props.access, {drawOffer: this.props.viewer})
        .then(response => this.restoreDefaults());
    }

    offerDraw = this.localOfferDraw.bind(this);

    localAcceptDraw () {
        console.log("accepting draw!", this);
        API.OTBAction(this.props.access, {drawOffer: "accepted"})
        .then(response => this.restoreDefaults());
    }

    acceptDraw = this.localAcceptDraw.bind(this);

    localRefuseDraw () {
        console.log("refusing draw!", this);
        API.OTBAction(this.props.access, {drawOffer: ""})
        .then(response => this.restoreDefaults());
    }

    refuseDraw = this.localRefuseDraw.bind(this);

    localResignGame () {
        console.log("resigning game!", this);
        let winner = this.props.viewer === "sente" ? "gote" : "sente"
        API.OTBAction(this.props.access, {resigned: this.props.viewer, winner})
        .then (response => this.restoreDefaults());
    }

    resignGame = this.localResignGame.bind(this);

    passSetState = this.setState.bind(this);

    render () {
        const OTBProps = {
            acceptDraw: this.acceptDraw,
            offerDraw: this.offerDraw,
            refuseDraw: this.refuseDraw,
            resignGame: this.resignGame,
        }

        return (
        <div>
            <Headline {...this.props} setState={this.passSetState}/>
            <MakeMove {...this.props}/>
            <OTBActions {...this.props} {...OTBProps}/>
            <PreviousMove/>
        </div>
        )
    }
}
export {Actions};