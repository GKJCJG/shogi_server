import React from "react";
import {Link} from "react-router-dom";

const Home = () => {
    return (
        <div className = "container">
            <h1>Shogi</h1>
            <section>
            <p>Play shogi online with your friends. It's fun, easy to get started, and free!</p>
            <p>This site was built by Colin Grant</p>
            </section>
            <Link to="/new">Make a new game.</Link>
        </div>
    )
}

export {Home};

