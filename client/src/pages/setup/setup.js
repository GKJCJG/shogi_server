import React, {Component} from "react";

const EntryForm = (props) => {
    return (
        <div>
            <div className="col-lg-4">
                <p>Your name:</p>
                <p>Your email:</p>
                <p>Opponent's name:</p>
                <p>Opponent's email:</p>
            </div>
            <div className="col-lg-4">
                <p><input className="form-control" name="initNick" value={props.initNick} onChange={props.onChange} required/></p>
                <p><input type="email" className="form-control" name="initContact" value={props.initContact} onChange={props.onChange} required/></p>
                <p><input className="form-control" name="oppNick" value={props.oppNick} onChange={props.onChange} required/></p>
                <p><input type="email" className="form-control" name="oppContact" value={props.oppContact} onChange={props.onChange} required/></p>
            </div>
        </div>
    )
};

const Options = (props) => {
    return (
        <div className="col-lg-4">
            <p>You are <span className="clickSpan" onClick={() => {props.swapColors(props.initColor, true)}}>{props.initColor}</span>.</p>
            <p>The game is <span className="clickSpan" onClick={() => {props.changeHandicap(props.handicap)}}>{props.handicap}</span>.</p>
            <p>Your opponent is <span className="clickSpan" onClick={() => {props.swapColors(props.initColor, true)}}>{props.swapColors(props.initColor, false)}</span>.</p>
        </div>
    )
}



class Setup extends Component {

    constructor() {
        super();
        this.state = {
          initNick: "",
          initContact: "",
          oppNick: "",
          oppContact: "",
          initColor: "sente",
          handicap: "even",
          message: "",
          success: false
        };
    }
    
    onChange = (event) => {
        const state = this.state
        state[event.target.name] = event.target.value;
        this.setState(state);
    };

    passOnChange = this.onChange.bind(this);

    swapColors = (color, stateChange) => {
        let newColor = color === "sente" ? "gote" : "sente";
        if (stateChange) {
            this.setState({initColor: newColor});
        } else {
            return newColor;
        }
    };

    passSwapColors = this.swapColors.bind(this);

    changeHandicap = (handicap) => {
        const possibleHandicaps = [
            "even",
            "lance",
            "bishop",
            "rook",
            "rook-lance",
            "two-piece",
            "three-piece",
            "four-piece",
            "five-piece",
            "six-piece",
            "seven-piece",
            "eight-piece",
            "nine-piece",
            "ten-piece"
        ];
    
        function findNewHandicap () {
            const currentIndex = possibleHandicaps.indexOf(handicap);
            if (currentIndex + 1 < possibleHandicaps.length) return possibleHandicaps[currentIndex + 1];
            return possibleHandicaps[0];
        }
    
        handicap = findNewHandicap();
    
        this.setState({handicap});
    };

    passChangeHandicap = this.changeHandicap.bind(this);

    render() {
        return (
        <div className = "container">
        <div className="row">
            <EntryForm {...this.state} onChange={this.passOnChange}/>
            <Options {...this.state} swapColors={this.passSwapColors} changeHandicap={this.passChangeHandicap}/>
        </div>
        </div>
    )}
}

export {Setup};

