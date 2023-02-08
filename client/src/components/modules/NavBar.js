import React, { Component } from "react";

import { NavbarBrand, NavbarText } from "reactstrap";

import "./NavBar.css";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="NavBar-container">
        <Navbar expand="md">
          <div className="NavBar-linkContainer u-inlineBlock">
            <NavbarBrand href="/">
              <img className="NavBar-logo" src="https://i.ibb.co/4Vkhcmp/Ivy-logo.png" />
            </NavbarBrand>
          </div>
          <NavbarText className="NavBar-text">Ivy Dynamical Dashboards</NavbarText>
        </Navbar>
      </div>
    );
  }
}

export default NavBar;
