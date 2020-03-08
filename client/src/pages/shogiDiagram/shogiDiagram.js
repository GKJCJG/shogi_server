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

const generateInitialState = () => ({
    string: "9/9/9/9/9/9/9/9/9/0000000/0000000",
    position: new FenString("9/9/9/9/9/9/9/9/9/0000000/0000000").translateToObject(),
    onPalette: { occupant: "", symbol: "" },
    dragee: { id: "", owner: "" },
});

class ShogiDiagram extends Component {

    constructor() {
        console.log("constructing....");
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
        if (event.target.id.search("sente") !== -1 || event.target.id.search("gote") !== -1) {
            this.handleHandClick(event);
        } else if (!isNaN(event.target.id)) {
            const square = event.target.id || event.target.parentElement.id;
            const owner = event.altKey ? null : event.button === 0 ? "sente" : "gote";
            this.handleSquareClick(square, owner);
        }
    }

    passHandleBoardClick = this.handleBoardClick.bind(this);

    handleSquareClick(square, owner) {
        this.setState(prevState => {
            const position = new DiagramPosition(prevState.position);
            if (!owner) {
                position.removePiece(square);
            } else {
                position.addPiece(square, prevState.onPalette.occupant, owner);
            }

            return {
                position: position.translateToPlainObject(),
                string: position.translateToString()
            };
        });
    }

    handleHandClick(event) {
        this.setState(prevState => {
            const position = new DiagramPosition(prevState.position);
            const owner = event.target.id.includes("-") ? event.target.id : event.target.id.substring(0, event.target.id.search("-"));
            const location = `${owner}Hand`;
            if (event.altKey) {
                position.removePieceFromHand(location, prevState.onPalette.occupant);
            } else {
                position.addPiece(location, prevState.onPalette.occupant);
            }
            return {
                position: position.translateToPlainObject(),
                string: position.translateToString()
            }
        })
    }

    handleType(event) {
        this.setState({ string: event.target.value, position: new FenString(event.target.value).translateToObject() });
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
        if (intendedKey in letterDictionary && event.target.tagName !== "TEXTAREA") {
            this.setActive(intendedKey, letterDictionary[intendedKey].symbol);
        } else if (intendedKey === "`") {
            this.setState(generateInitialState());
        } else if (intendedKey === "c") {
            navigator.clipboard.writeText(this.state.string);
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
        if ((isNaN(parseInt(id)) && id !== "gote" && id !== "sente") || !this.state.dragee.id) {
            return;
        }
        const location = isNaN(id) ? `${id}Hand` : id;
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
        console.log("rendering...");
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