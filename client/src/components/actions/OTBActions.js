import React from "react";

const OTBActions = (props) => {
    const allowClick = (cb) => {
        if (props.canRespond || props.canPlay) return cb;
        return null;
    }
    const isActive = () => props.canPlay || props.canRespond ? "clickSpan" : "idleSpan";
    
    return <div><span className={isActive()} onClick={allowClick(props.resignGame)}>resign »</span> or <DrawOptions {...props} isActive={isActive} allowClick={allowClick}/></div>
}

const DrawOptions = (props) => {
    const opponent = props.viewer === "sente" ? "gote" : "sente";
    if (props.drawOffer === opponent) {
        return <span><span className={props.isActive()} onClick={props.acceptDraw}>accept draw »</span> or <span className={props.isActive()} onClick={props.refuseDraw}>refuse draw »</span></span>
    }
    return <span onClick={props.allowClick(props.offerDraw)} className={props.isActive()}>offer draw »</span>
}

export default OTBActions;