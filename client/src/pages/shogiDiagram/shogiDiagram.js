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
        let position = this.state.position;
        if (!owner) {
            position[square] = { occupant: null, class: [null], symbol: null };
        } else {
            position[square] = { occupant: this.state.onPalette.occupant, class: [owner], symbol: this.state.onPalette.symbol };
        }

        this.setState({ position, string: new DiagramPosition(position).translateToString() });
    }

    handleHandClick(event) {
        const pieceOrder = ["歩", "香", "桂", "銀", "金", "角", "飛"];
        let position = this.state.position;
        const owner = event.target.id.search("-") === -1 ? event.target.id : event.target.id.substring(0, event.target.id.search("-"));
        let targetArray = position[owner + "Hand"].occupants;
        const index = pieceOrder.indexOf(this.state.onPalette.occupant);
        if (index !== -1) {
            if (event.altKey) {
                targetArray[index].number--;
                if (targetArray[index].number < 0) targetArray[index].number = 0;
            } else {
                targetArray[index].number++;
            }
        }

        this.setState({ position, string: new DiagramPosition(position).translateToString() });
    }

    handleType(event) {
        this.setState({ string: event.target.value, position: new FenString(event.target.value).translateToObject() });
    }

    passHandleType = this.handleType.bind(this);

    setActive(symbol, occupant) {
        const newPalette = {
            symbol,
            occupant
        };

        this.setState({ onPalette: newPalette });
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
        // console.log("Start");
        // console.log(event.target);
        // console.log(this.state.position);
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
        // console.log("End");
        // console.log(event.target);
        // console.log(this.state.dragee);
        // console.log(this.state.onPalette);

        const id = event.target.id;
        // console.log(id);
        if ((isNaN(parseInt(id)) && id !== "gote" && id !== "sente") || !this.state.dragee.id) {
            return;
        }
        if (!isNaN(this.state.dragee.id)) {

            if (!isNaN(id)) {

                this.setState(prevState => {
                    const { position } = prevState;
                    // console.log(this.state.dragee.id, id);
                    position[this.state.dragee.id] = { occupant: null, class: [null], symbol: null };
                    position[id] = { occupant: this.state.onPalette.occupant, class: [this.state.dragee.owner], symbol: this.state.onPalette.symbol };
                    const string = new DiagramPosition(position).translateToString();
                    const onPalette = generateInitialState().onPalette;

                    return { position, string, onPalette };
                });
            } else {
                // console.log("trying to drop in the hand!");
                this.setState(prevState => {
                    const { position } = prevState;
                    const pieceHolder = position[`${id}Hand`].occupants.find(occupant => occupant.symbol === this.state.onPalette.occupant);
                    position[this.state.dragee.id] = { occupant: null, class: [null], symbol: null };
                    pieceHolder.number++;
                    const string = new DiagramPosition(position).translateToString();
                    const onPalette = generateInitialState().onPalette;
                    return { position, string, onPalette }
                })
            }
        } else {
            this.setState(prevState => {
                const { position } = prevState;
                position[id] = { occupant: this.state.onPalette.occupant, class: [this.state.dragee.owner], symbol: this.state.onPalette.symbol };
                // console.log(this.state.dragee);
                const pieceHolder = position[this.state.dragee.id].occupants.find(occupant => occupant.symbol === this.state.onPalette.occupant);
                pieceHolder.number--;
                const string = new DiagramPosition(position).translateToString();
                const onPalette = generateInitialState().onPalette;

                return { position, string, onPalette };
            });
        }
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