import React, { Component } from "react";
import Board from "./../../components/board/diagramBoard";
import { FenString, DiagramPosition } from "../../utils/diagramClasses";
import { letterDictionary, symbolDictionary } from "../../utils/dictionaries";
import Palette from "../../components/diagramSidebar/palette";
import FenEntry from "../../components/diagramSidebar/fenEntry";
import "./diagram.css";

const Directions = () => (
    <div id="directions">
        Using this diagram generator, you can create both images and SFEN-like strings that represent board positions. You may create your diagram by clicking on the icons below and then placing each piece on the board, or you can edit the SFEN string below. Or do a bit of both - both the board and the string will update with each change.
    </div>
)

const STARTING_POSITION = "LNSGKGSNL/1R5B1/PPPPPPPPP/9/9/9/ppppppppp/1b5r1/lnsgkgsnl/0000000/0000000";
const EMPTY_BOARD = "9/9/9/9/9/9/9/9/9/0000000/0000000";

const generateInitialState = (fenString = EMPTY_BOARD) => ({
    string: fenString,
    position: new FenString(fenString).translateToObject(),
    onPalette: { occupant: "", symbol: "" },
    dragee: { id: "", owner: "" },
});

class ShogiDiagram extends Component {

    constructor() {
        super();

        this.state = generateInitialState();
    }

    componentDidMount() {
        window.addEventListener("keypress", this.passHandleKeyPress);
    }

    componentWillUnmount() {
        window.removeEventListener("keypress", this.passHandleKeyPress);
    }

    handleBoardClick(event) {
        event.preventDefault();
        event.stopPropagation();
        if (!this.state.onPalette.symbol || !(this.state.onPalette.symbol in letterDictionary)) {
            return;
        }
        const id = event.target.id || event.target.parentElement.id;
        const button = event.button;
        const owner = this.getOwnerFromID({id, button});
        const location = this.getLocationFromID(id, owner);
        const remove = event.altKey;
        this.setState(prevState => {
            const piece = prevState.onPalette.occupant;
            const position = new DiagramPosition(prevState.position);
            if (remove) {
                position.removePiece(location, piece);
            } else {
                position.addPiece(location, piece, owner);
            }

            return {
                position: position.translateToPlainObject(),
                string: position.translateToString()
            }
        });
    }

    getOwnerFromID({id, button}) {
        console.log(id, button);
        if (/te/.test(id)) {
            return id.includes("sente") ? "sente" : "gote";
        } else {
            return button === 0 ? "sente" : "gote";
        }
    }

    getLocationFromID(id, owner) {
        console.log(id, owner);
        if (parseInt(id)) {
            return id;
        } else {
            return `${owner}Hand`;
        }
    }

    passHandleBoardClick = this.handleBoardClick.bind(this);

    handleType(event) {
        const impermissibleCharacters = /[^\dptlxnhsqbmrdgk/]/i
        if (!impermissibleCharacters.test(event.target.value)) {
            this.setState({ string: event.target.value, position: new FenString(event.target.value).translateToObject() });
        }
    }

    passHandleType = this.handleType.bind(this);

    setActive(symbol, occupant) {
        const onPalette = {
            symbol,
            occupant
        };

        this.setState({ onPalette });
    }

    passSetActive = this.setActive.bind(this);

    handleKeyPress(event) {
        const intendedKey = event.key.toLowerCase();
        if (event.target.tagName === "TEXTAREA") {
            return;
        } else if (intendedKey in letterDictionary) {
            this.setActive(intendedKey, letterDictionary[intendedKey].symbol);
        } else if (intendedKey === "`") {
            this.setState(generateInitialState());
        } else if (intendedKey === "c") {
            navigator.clipboard.writeText(this.state.string);
        } else if (intendedKey === "i") {
            this.setState(generateInitialState(STARTING_POSITION));
        }
    }

    passHandleKeyPress = this.handleKeyPress.bind(this);

    handleDragStart(event) {
        if (!event.target.textContent) {
            return;
        }

        if (!isNaN(event.target.id)) {
            const occupant = event.target.textContent.trim();
            const owner = event.target.classList.contains("sente") ? "sente" : "gote";
            const id = event.target.id;

            this.setState({
                dragee: { owner, id },
                onPalette: { occupant, symbol: symbolDictionary[occupant].letter }
            })
        } else if (/te-/.test(event.target.id)) {
            const occupant = event.target.textContent.trim()[0];
            const ownerHolder = event.target.id;
            const owner = ownerHolder.substring(0, ownerHolder.indexOf("-"));
            const id = `${owner}Hand`;
            this.setState({
                dragee: { owner, id },
                onPalette: { occupant, symbol: symbolDictionary[occupant].letter }
            });
        }
    }

    passHandleDragStart = this.handleDragStart.bind(this);

    handleDrop(event) {
        const id = event.target.id;
        if ((isNaN(parseInt(id)) && /te/.test(id) === false) || !this.state.dragee.id) {
            return;
        }
        const location = isNaN(id) ? `${id.substring(0, id.indexOf("-"))}Hand` : id;
        this.setState(prevState => {
            const position = new DiagramPosition(prevState.position);
            position.removePiece(prevState.dragee.id, prevState.onPalette.occupant);
            position.addPiece(location, this.state.onPalette.occupant, this.state.dragee.owner);

            return {
                position: position.translateToPlainObject(),
                string: position.translateToString(),
                onPalette: generateInitialState().onPalette
            };
        });
    }

    passHandleDrop = this.handleDrop.bind(this);

    render() {
        return (
            <div className="gameContainer">
                <Board position={this.state.position} handleBoardClick={this.passHandleBoardClick} handleDragStart={this.passHandleDragStart} handleDrop={this.passHandleDrop} />
                <div className="nonBoard">
                    <Directions />
                    <FenEntry onChange={this.passHandleType} value={this.state.string} />
                    <Palette setActive={this.passSetActive} onPalette={this.state.onPalette} />
                </div>
            </div>
        );
    }

}

export { ShogiDiagram };