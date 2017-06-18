import React, { Component } from "react";
import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
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
            <NavbarBrand href="/">kaboard</NavbarBrand>
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                {this.props.children.map((item, i) => {
                  return (
                    <NavItem key={i}>
                      {React.cloneElement(item, { className: "nav-link" })}
                    </NavItem>
                  );
                })}
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default AppHeader;
