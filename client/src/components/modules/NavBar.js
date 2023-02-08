import React, { Component } from "react";

import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from "reactstrap";

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
