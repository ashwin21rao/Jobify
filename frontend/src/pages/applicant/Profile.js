import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import ApplicantNavbar from "./Navbar";
import { Container, Row, Col } from "react-bootstrap/";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import MainHeading from "../../components/MainHeading";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

class ApplicantProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: props.auth.user.userType === "applicant",
      fetching: true,
    };
    this.addEducation = this.addEducation.bind(this);
    this.removeEducation = this.removeEducation.bind(this);
    this.addSkill = this.addSkill.bind(this);
    this.removeSkill = this.removeSkill.bind(this);
  }

  componentDidMount() {
    // get applicant profile
    const { user } = this.props.auth;
    axios
      .post("/applicant/profile/load", {
        user_id: user.id,
      })
      .then((res) => {
        this.setState({ profileData: res.data, fetching: false });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  addEducation(e) {
    e.preventDefault();
    const { institute_name, start_year, end_year } = e.target.elements;
    const { user } = this.props.auth;

    axios
      .post("/applicant/profile/addeducation", {
        user_id: user.id,
        institute_name: institute_name.value,
        start_year: start_year.value,
        end_year: end_year.value,
      })
      .then((res) => {
        console.log(res);
        this.setState({ profileData: res.data });

        Array.from(e.target.elements).forEach((ele) => {
          ele.value = "";
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  removeEducation(e, education) {
    e.preventDefault();
    const { user } = this.props.auth;
    const { institute_name, start_year, end_year } = education;

    axios
      .post("/applicant/profile/removeeducation", {
        user_id: user.id,
        institute_name,
        start_year,
        end_year,
      })
      .then((res) => {
        this.setState({ profileData: res.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  addSkill(e) {
    e.preventDefault();
    const { skill } = e.target.elements;
    const { user } = this.props.auth;

    axios
      .post("/applicant/profile/addskill", {
        user_id: user.id,
        skill: skill.value,
      })
      .then((res) => {
        console.log(res);
        this.setState({ profileData: res.data });

        Array.from(e.target.elements).forEach((ele) => {
          ele.value = "";
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  removeSkill(e, skill) {
    e.preventDefault();
    const { user } = this.props.auth;

    axios
      .post("/applicant/profile/removeskill", {
        user_id: user.id,
        skill,
      })
      .then((res) => {
        this.setState({ profileData: res.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    if (!this.state.authorized) {
      this.props.history.goBack();
      return <></>;
    }

    if (this.state.fetching) {
      return <React.Fragment>Fetching data...</React.Fragment>;
    }

    const { profileData } = this.state;

    return (
      <React.Fragment>
        <ApplicantNavbar />
        <Container fluid="lg">
          <Row className="mt-3 mb-3">
            <Col xs={12}>
              <MainHeading heading="My Profile" />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <h3>Personal Details</h3>
              <Form onSubmit={(e) => e.preventDefault()}>
                <Row>
                  <Col xs={12} md={4}>
                    <Form.Group controlId="detailsName">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control defaultValue={profileData.name} readOnly />
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={4}>
                    <Form.Group controlId="detailsEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        defaultValue={profileData.email}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={4}>
                    <Form.Group controlId="detailsRating">
                      <Form.Label>Rating</Form.Label>
                      <Form.Control value={profileData.rating} readOnly />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col xs="auto">
                    <Button variant="outline-success" type="submit">
                      Update details
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <div className="education__container">
                <h3>Education</h3>
                <Table striped bordered hover responsive="lg">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Institute Name</th>
                      <th>Start Year</th>
                      <th>End Year</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profileData.education.map((obj, i) => (
                      <tr>
                        <td>{i + 1}</td>
                        <td>{obj.institute_name}</td>
                        <td>{obj.start_year}</td>
                        <td>{obj.end_year}</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            onClick={(e) => this.removeEducation(e, obj)}
                          >
                            Delete Entry
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Form onSubmit={this.addEducation}>
                  <Row>
                    <Col xs={12} sm={4} md="auto">
                      <Form.Group controlId="institute_name">
                        <Form.Control placeholder="College Name" required />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={4} md="auto">
                      <Form.Group controlId="start_year">
                        <Form.Control
                          placeholder="Start Year"
                          required
                          type="number"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={4} md="auto">
                      <Form.Group controlId="end_year">
                        <Form.Control placeholder="End Year" />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm="auto">
                      <Button variant="outline-success" type="submit">
                        Add entry
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <div className="skills_container">
                <h3>Skills</h3>
                <Table striped bordered hover responsive="lg">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Skill</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profileData.skills.map((skill, i) => (
                      <tr>
                        <td>{i + 1}</td>
                        <td>{skill}</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            type="submit"
                            onClick={(e) => this.removeSkill(e, skill)}
                          >
                            Delete Entry
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Form onSubmit={this.addSkill}>
                  <Row>
                    <Col xs={12} sm="auto">
                      <Form.Group controlId="skill">
                        <Form.Control placeholder="Skill" required />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm="auto">
                      <Button variant="outline-success" type="submit">
                        Add skill
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

ApplicantProfile.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ApplicantProfile);
