import axios from "axios";

const API = {
    createGame: (game) => {
        return axios.post("/api/games/new", game);
    }
};

export default API;