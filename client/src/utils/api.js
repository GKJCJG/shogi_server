import axios from "axios";

const API = {
    createGame: (game) => {
        return axios.post("/api/games/new", game);
    },
    getGame: (game) => {
        return axios.get("/api/games/" + game)
    },
    makeMove: (game, move) => {
        return axios.post("/api/games/" + game + "/move", move)
    },
    OTBAction: (game, action) => {
        return axios.put("/api/games/" + game, action)
    }
};

export default API;