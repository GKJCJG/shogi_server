import React, {Component} from "react";
import {Link} from "react-router-dom";
import API from "../../utils/api";
import "./setup.css";

const Labels = () => (
    <div id="labels">
        <p>Your name:</p>
        <p>Your email:</p>
        <p>Opponent's name:</p>
        <p>Opponent's email:</p>
    </div>
)
const InputFields = (props) => {
    return (
            <div id="inputFields">
                <p><input className="form-control" name="initNick" value={props.initNick} onChange={props.onChange} required/></p>
                <p><input type="email" className="form-control" name="initContact" value={props.initContact} onChange={props.onChange} required/></p>
                <p><input className="form-control" name="oppNick" value={props.oppNick} onChange={props.onChange} required/></p>
                <p><input type="email" className="form-control" name="oppContact" value={props.oppContact} onChange={props.onChange} required/></p>
            </div>
    )
};

const Options = (props) => {
    const handicapText = () => props.handicap === "even" ? "no" : props.handicap === "eight-piece" ? "an " + props.handicap: "a " + props.handicap;
    return (
        <div id="options">
            <p>You are <span className="clickSpan" onClick={() => {props.swapColors(props.initColor, true)}}>{props.initColor}</span>.</p>
            <p>Gote has <span className="clickSpan" onClick={() => {props.changeHandicap(props.handicap)}}>{handicapText()}</span> handicap.</p>
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
          success: false,
          linkDest: ""
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

    submitGame = () => {
        const {initNick, initContact, oppNick, oppContact, handicap, initColor} = this.state;
        let game = {};
        
        if (initColor === "sente") {
            game = {
                handicap: handicap==="even" ? null : handicap,
                senteNick: initNick,
                senteContact: initContact,
                goteNick: oppNick,
                goteContact: oppContact
            }
        } else {
            game = {
                handicap: handicap==="even" ? null : handicap,
                senteNick: oppNick,
                senteContact: oppContact,
                goteNick: initNick,
                goteContact: initContact
            }
        }
        API.createGame(game)
        .then(response => {
            let linkDest = "/game/" + response.data[this.state.initColor+"Access"];
            let success = true;
            this.setState({linkDest, success});
        })
        .catch(error => {
            console.log(error);
            this.setState({message: error});
        });
    }

    render() {

        return (
        <div className = "container">
            <Labels/>
            <InputFields {...this.state} onChange={this.passOnChange}/>
            <Options {...this.state} swapColors={this.passSwapColors} changeHandicap={this.passChangeHandicap}/>
            
            {this.state.success ? 
            (   <div id="successMessage" className="row">
                    <div>Success! Your game has been created.</div>
                    <Link to={this.state.linkDest}>Go to game!</Link>
                </div>
            ) 
            : <div className="clickSpan row" onClick={this.submitGame}>Start game!</div>}
        </div>
    )}
}

export {Setup};

