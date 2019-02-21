import axios from "axios";

const API = {
    createGame: (game) => {
        return axios.post("/api/games/new", game);
    },
    getGame: (game) => {
        return axios.get("/api/games/" + game);
    },
    makeMove: (game, move) => {
        return axios.post("/api/games/" + game + "/moves", move);
    },
    addMessage: (game, message) => {
        return axios.post("/api/games/" + game + "/messages", message);
    },
    OTBAction: (game, action) => {
        return axios.put("/api/games/" + game, action);
    }
};

export default API;