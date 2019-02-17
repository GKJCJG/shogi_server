import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import API from './utils/API';
import {Navbar, Game, Setup, Home, Dashboard, Login, Register} from "./pages/appIndex";

class App extends Component {

  state = {
    status: "visitor"
  }

  componentDidMount() {
    this.getStatus();
  }

  getStatus = () => {
    API.getStatus()
    .then(status => {
      this.setState({status:status.data.status})
    })
  }

  passGetStatus = this.getStatus.bind(this);

  render() {
    return (
      <Router>
      <div>
        <Navbar isAuth={this.state.status}/>
          <Route exact path="/play/:id" component={Game} />
          <Route exact path="/play/new" component={Setup} />
          <Route path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route exact path="/login" render={() => <Login getStatus={this.passGetStatus}/>} />
          <Route exact path="/register" component={Register} />
      </div>
    </Router>
    );
  }
}

export default App;