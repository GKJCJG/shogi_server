import axios from "axios";

const API = {
    createGame: (game) => {
        return axios.post("/api/games/new", game);
    },
    getGame: (game) => {
        return axios.get("/api/games/" + game)
    }
};

export default API;