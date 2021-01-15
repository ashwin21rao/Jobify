import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../components/Navbar.css";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../app/actions/authActions";

class RecruiterNavbar extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  logout(e) {
    e.preventDefault();
    this.props.logoutUser();
  }

  render() {
    return (
      <Navbar expand="md" sticky="top" className="navbar-custom">
        <Navbar.Brand>Jobify.</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Navbar.Text className="mr-3">
              <Link to="/recruiter/dashboard">Dashboard</Link>
            </Navbar.Text>
            <Navbar.Text className="mr-3">
              <Link to="/recruiter/profile">Profile</Link>
            </Navbar.Text>
            <Navbar.Text className="mr-3">
              <Link to="/recruiter/acceptances">Accepted employees</Link>
            </Navbar.Text>
            <Navbar.Text className="mr-3">
              <Link to="/recruiter/addlisting">Add Listing</Link>
            </Navbar.Text>
          </Nav>
          <Nav>
            <Navbar.Text className="mr-3">
              Signed in as {this.props.auth.user.name.split(" ")[0]}
            </Navbar.Text>
            <Button variant="primary" type="submit" onClick={this.logout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

RecruiterNavbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(RecruiterNavbar);
