import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavText,
  NavItem,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";

import User from "../../../containers/User/MenuItem";

class AppHeader extends Component {
  state = {
    isOpen: false
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    return (
      <div>
        <Navbar color="inverse" inverse toggleable>
          <Container>
            <NavbarToggler right onClick={this.toggle} />
            <Link className="navbar-brand" to="/">
              kapoard
            </Link>

            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <HeaderLink to="/boards">
                  Boards
                </HeaderLink>
                <NavItem><User /></NavItem>
              </Nav>

            </Collapse>

          </Container>
        </Navbar>
      </div>
    );
  }
}

const HeaderLink = props =>
  <NavItem>
    <NavLink to={props.to} className="nav-link" activeClassName="active">
      {props.children}
    </NavLink>
  </NavItem>;

export default AppHeader;
