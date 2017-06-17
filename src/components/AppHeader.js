import React, { Component } from "react";
import {
  Collapse,
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
        </Navbar>

        <div>
          <Modal isOpen={this.state.showAbout} toggle={this.toggleAbout}>
            <ModalHeader toggle={this.toggleAbout}>
              O aplikaci Matchbox algebra
            </ModalHeader>
            <ModalBody>
              <p>
                Aplikace Matchbox algebra vznikla pro obohacení výuky rovnic. Aplikace je více než inspirována
                appletem
                {" "}
                <a
                  href="http://66.147.244.109/~mathsapp/mathsapplets/page2/page54/index.html"
                  target="_blank"
                >
                  Matchbox algebra
                </a>
                ,
                který již není funkční a tato aplikace je jeho náhradou.
              </p>
              <p>
                Autor je studentem PedF UK a práce byla součástí jeho zápočtu na předmět Didaktika matematiky I. Aplikace
                je Open source, zdrojové kódy jsou dostupné na
                {" "}
                <a href="https://github.com/maral/matchbox" target="_blank">
                  Githubu
                </a>
                .
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggleAbout}>
                Zavřít
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}

export default AppHeader;
