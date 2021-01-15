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

class ApplicantNavbar extends Component {
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
      <Navbar expand="sm" sticky="top" className="navbar-custom">
        <Navbar.Brand>Jobify.</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Navbar.Text className="mr-3">
              <Link to="/applicant/dashboard">Dashboard</Link>
            </Navbar.Text>
            <Navbar.Text className="mr-3">
              <Link to="/applicant/profile">Profile</Link>
            </Navbar.Text>
            <Navbar.Text className="mr-3">
              <Link to="/applicant/applications">My applications</Link>
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

ApplicantNavbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(ApplicantNavbar);
