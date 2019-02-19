import React, {Component} from "react";
import "./board.css";
import API from "../../utils/api";
import gameLogic from "../../utils/gameLogic";

const PieceStand = (props) => (
    <div id={props.id}>
        {props.occupants
            .map((piece, index) => piece.number > 0 ?
            (<div key={props.id+"piece"+index} className="pieceIcon" id={props.id+"-"+piece.name}>
                {piece.symbol}{piece.number > 1 ? <span className="handMult" id={piece.name+"multiplier"}>{piece.number}</span> : null}
            </div>)
            :
            null)}
    </div>
)

const PlaySpace = (props) => {
    let superPosition;
    let {origin, target, piece} = props.move;

    if(props.stage === "consider") {
        const spText = piece ? props.position.senteHand.filter(e => e.name === piece)[0].symbol : props.position[origin].occupant;
        const spStyle = {
            position: "absolute",
            left: "3px",
            top: 0,
            backgroundColor: "rgba(87, 219, 87)",
            opacity: props.position[target].class.includes("gote") ? 1 : 0.7
        };
        superPosition = <span className = {props.position[target].class.includes("gote") ? "gote" : null} style={spStyle}>{spText}</span>;
    }

    const computeTd = (i, j) => <td key={tdKey(i, j)}
        id={tdId(i, j)}
        className={tdClass(i, j)}
        style={tdStyle(i, j)}>
        {tdText(i, j)}
        {tdSuperPosition(i, j)}
        </td>
    const tdClass = (i, j) => "boardSquare " + props.position[""+(10-j)+i].class.join(" ");
    const tdText = (i, j) => props.position[""+(10-j)+i].occupant;
    const tdKey = (i, j) => "square"+(10-j)+i;
    const tdId = (i, j) => ""+(10-j)+i;
    const tdStyle = (i, j) => {
        if (props.stage === "consider") {
            if ("" + (10-j) + i === origin) {
                return {opacity: 0.3};
            } else if ("" + (10-j) + i === target) {
                return {position: "relative"};
            }
        }    
        return null;
    }
    const tdSuperPosition = (i, j) => {
        if (props.stage==="consider" && "" + (10-j) + i === target) return superPosition;
        return null;
    }

    const computeFileNumber = (i) => <td key={fnKey(i)} id={fnKey(i)} className="right">{fnText(i)}</td>;
    const fnKey = (i) => "rank" + i;
    const fnText = (i) => ["一", "二", "三", "四", "五", "六", "七", "八", "九"][i-1];
        
    

    const renderRows = () => {
        const output = [];
        for(let i = 0; i < 10; i++) {
            const cells = []
            if (i===0) {
                for(let j = 1; j < 10; j++) {
                    cells.push(<td key={"file"+j} id={"file"+j} className="top">{10-j}</td>)
                }
            } else {
                for(let j = 1; j < 11; j++) {
                    if (j < 10) cells.push(computeTd(i, j));
                    if (j === 10) cells.push(computeFileNumber(i));
                }
            }
            output.push(<tr key={"row" + i}>{cells}</tr>);
        }

        return output;
    }

    return (
        <tbody>
            {renderRows()}
        </tbody>
    )
}

class Board extends Component {

    constructor (props) {
        super()
        this.state = {
            position: {},
            candidates: [],
            move: {},
            stage: "touch"
        };

        this.activateAPI = props.activateAPI;
    }

    componentDidMount () {
        this.getGame();
    }

    getGame () {
        API.getGame(this.props.access)
        .then(response => {
            this.readGame(response.data.handicap, response.data.moves);
            
            this.setPosition();
        });
    }

    readGame (handicap, moves) {
        this.gameBoard = new gameLogic(handicap);
        this.gameBoard.initialize();
        this.gameBoard.readMoves(moves);
    }

    setPosition () {
        const position = this.gameBoard.render();
        this.setState({position});
    }

    localSetCandidates (event) {
        function markSquares (coordinates) {
            coordinates.forEach(e => {
                position[e].class.push("candidate");
                candidates.push(e);
            })
        }

        // retrieve position and candidates.
        let {position, candidates} = this.state;
        
        //Clear existing candidates.
        candidates.forEach(e => {
            position[e].class.splice(position[e].class.indexOf("candidate"), 1);
        });

        // let game know that we're not ready
        this.activateAPI(false);
        
        candidates = [];
        let move = {};

        // use DOM properties of board elements to calculate appropriate new candidates.
        if(event.target.classList.contains("boardSquare")) {
            markSquares(position[event.target.id].moves);
            move.origin = event.target.id
        } else if (event.target.classList.contains("handMult") || event.target.classList.contains("pieceIcon")) {
            let dropPiece = event.target.classList.contains("handMult") ? event.target.parentElement.id.split("-")[1] : event.target.id.split("-")[1];
            let dropSquares = position.drops
                .filter(e => e.piece === dropPiece)
                .map(e => e.target);
            markSquares(dropSquares);
            move.origin = event.target.parentElement.id.split("-")[0] + "Hand";
            move.piece = dropPiece;
        }

        let stage = candidates.length ? "choose" : "touch";

        this.setState({position, candidates, move, stage});
    }

    setCandidates = this.localSetCandidates.bind(this);

    localPreviewMove (event) {
        
        if (!event.target.classList.contains("candidate")) return this.setCandidates(event);

        let {move} = this.state;
        move.target = event.target.id;

        let stage = "consider";
        
        this.setState({move, stage});
        this.activateAPI(true)
    }

    previewMove = this.localPreviewMove.bind(this);

    render () {
        return (
            this.state.position[11] ?
            (<div id="diagramContainer" onClick={this.state.stage === "touch" ? this.setCandidates : this.previewMove}>
                <PieceStand id="gote" occupants={this.state.position.goteHand}/>
                <table className="shogiDiagram">
                    <PlaySpace {...this.state}/>
                </table>
                <PieceStand id="sente" occupants={this.state.position.senteHand}/>
            </div>)
            :
            null
        );
    }
}

export {Board};