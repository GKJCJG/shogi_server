import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import {Game, Setup, Home, Dashboard, Login, Register, ShogiDiagram} from "./pages/appIndex";

class App extends Component {

  render() {
    return (
      <Router>
      <div>
        {/* <Navbar/> */}
          <Route exact path="/new" component={Setup} />
          <Route exact path="/game/:id" component={Game} />
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/diagram/shogi" component={ShogiDiagram}/>
          <Route path="/dashboard" component={Dashboard} />
          <Route exact path="/login" render={() => <Login getStatus={this.passGetStatus}/>} />
          <Route exact path="/register" component={Register} />
      </div>
    </Router>
    );
  }
}

export default App;