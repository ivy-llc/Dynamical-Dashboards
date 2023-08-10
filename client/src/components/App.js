import React, { Component } from "react";
import NavBar from "./modules/NavBar.js";
import { Router } from "@reach/router";
import Home from "./pages/Home.js";
import Priority from "./pages/Priority.js";
import NotFound from "./pages/NotFound.js";

import "../utilities.css";
import "./App.css";

/**
 * Define the "App" component as a class.
 */

class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <NavBar />
        <div className="App-container">
          <Router>
            <Home path="/" module={null} submodule={null} backend={null} frontend={null} />
            <Home path="/:module" submodule={null} backend={null} frontend={null} />
            <Home path="/:module/:submodule" backend={null} frontend={null} />
            <Home path="/:module/:submodule/:backend" frontend={null} />
            <Home path="/:module/:submodule/:backend/:frontend" />
            <Priority path="/priority" />
            <NotFound default />
          </Router>
        </div>
      </>
    );
  }
}

export default App;
