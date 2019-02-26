import React from "react";

const Headline = (props) => {
    return (
    <div>
        <PlayerBox {...props}/>
        <CurrentOptions {...props}/>
    </div>
    )
}

const PlayerBox = (props) => {
    const senteNick = props.viewer === "sente" ? props.playerNick : props.opponentNick;
    const goteNick = props.viewer === "sente" ? props.opponentNick : props.playerNick;
    const senteIcon = props.viewer === "sente" ? "☗" : "⛊";
    const goteIcon = props.viewer === "sente" ? "⛉" : "☖";

    return <h2 className = "playerBox">{senteIcon} {senteNick} vs. {goteIcon} {goteNick}</h2>
}

const CurrentOptions = (props) => {
    if (props.drawOffer === "accepted") {
        return <div>This game has ended in a draw.</div>
    } else if (props.drawOffer && props.drawOffer !== props.viewer) {
        return <div>Your opponent has offered a draw. Please accept or decline.</div>
    } else if (props.drawOffer) {
        return <div>You have made a draw offer and are awaiting a response.</div>
    } else if (props.resigned) {
        return <div>This game has ended by resignation. {props.resigned === props.viewer ? props.opponentNick + " has" : "You have"} won.</div>
    } else if (props.winner) {
        return <div>This game has ended by checkmate. {props.winner === props.viewer ? "You have" : props.opponentNick + " has"} won.</div>
    } else if (!props.canPlay) {
        return <div>You are waiting for {props.opponentNick} to move.</div>
    } else if (props.APIready) {
        return <div>You may click elsewhere to make a different move.</div>
    } else {
        return <div>It is your turn to move. {props.inCheck ? "You are in check." : null}</div>
    }
}
export default Headline;