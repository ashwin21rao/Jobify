import React from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../components/Navbar.css";

function ApplicantNavbar() {
  return (
    <Navbar expand="sm" sticky="top" className="navbar-custom">
      <Navbar.Brand>Jobify.</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Navbar.Text className="mr-3">
            <Link to="/dashboard">Dashboard</Link>
          </Navbar.Text>
          <Navbar.Text className="mr-3">
            <Link to="/profile">Profile</Link>
          </Navbar.Text>
          <Navbar.Text className="mr-3">
            <Link to="/applications">My applications</Link>
          </Navbar.Text>
        </Nav>
        <Nav>
          <Button variant="primary" type="submit">
            Logout
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

function RecruiterNavbar() {
  return (
    <Navbar expand="sm" sticky="top" className="navbar-custom">
      <Navbar.Brand>Jobify.</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Navbar.Text className="mr-3">
            <Link to="/dashboard">Dashboard</Link>
          </Navbar.Text>
          <Navbar.Text className="mr-3">
            <Link to="/profile">Profile</Link>
          </Navbar.Text>
          <Navbar.Text className="mr-3">
            <Link to="/applications">Accepted employees</Link>
          </Navbar.Text>
        </Nav>
        <Nav>
          <Button variant="primary" type="submit">
            Logout
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default ApplicantNavbar;
