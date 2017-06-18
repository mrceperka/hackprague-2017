import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";

class AppHeader extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      showAbout: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  toggleAbout = () => {
    this.setState({
      showAbout: !this.state.showAbout
    });
  };

  render() {
    return (
      <div>
        <Navbar color="inverse" inverse toggleable>
          <Container>
            <NavbarToggler right onClick={this.toggle} />
            <Link className="navbar-brand" to="/">
              kaboard
            </Link>

            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <HeaderLink to="/">Home</HeaderLink>
                <HeaderLink to="/boards">
                  Boards
                </HeaderLink>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

function HeaderLink(props) {
  return (
    <NavItem>
      <NavLink to={props.to} className="nav-link" activeClassName="active">
        {props.children}
      </NavLink>
    </NavItem>
  );
}

export default AppHeader;
