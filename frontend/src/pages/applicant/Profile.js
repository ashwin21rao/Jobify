import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import ApplicantNavbar from "./Navbar";
import { Container, Row, Col } from "react-bootstrap/";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import MainHeading from "../../components/MainHeading";

import { connect } from "react-redux";
import PropTypes from "prop-types";

const user = {
  name: "Ashwin Rao",
  email: "ashwin@gmail.com",
  rating: 5,
  skills: ["C", "C++", "Python"],
  education: [
    {
      name: "IIIT",
      startYear: 2019,
      endYear: 2023,
    },
    {
      name: "IIIT",
      startYear: 2019,
      endYear: 2023,
    },
    {
      name: "IIIT",
      startYear: 2019,
      endYear: 2023,
    },
  ],
};

class ApplicantProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: true,
    };
  }

  componentWillMount() {
    // recruiter cannot view applicant pages
    this.state.authorized = this.props.auth.user.userType === "applicant";
  }

  render() {
    if (!this.state.authorized) {
      this.props.history.goBack();
      return <></>;
    }

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
              <Form>
                <Row>
                  <Col xs={12} md={4}>
                    <Form.Group controlId="detailsName">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control defaultValue={user.name} readOnly />
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={4}>
                    <Form.Group controlId="detailsEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        defaultValue={user.email}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={4}>
                    <Form.Group controlId="detailsRating">
                      <Form.Label>Rating</Form.Label>
                      <Form.Control value={user.rating} readOnly />
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
                      <th>Name</th>
                      <th>Start Year</th>
                      <th>End Year</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.education.map((obj, i) => (
                      <tr>
                        <td>{i + 1}</td>
                        <td>{obj.name}</td>
                        <td>{obj.startYear}</td>
                        <td>{obj.endYear}</td>
                        <td>
                          <Button variant="outline-danger">Delete Entry</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Form>
                  <Row>
                    <Col xs={12} sm={4} md="auto">
                      <Form.Group controlId="name">
                        <Form.Control placeholder="College Name" />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={4} md="auto">
                      <Form.Group controlId="startYear">
                        <Form.Control placeholder="Start Year" />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={4} md="auto">
                      <Form.Group controlId="endYear">
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
                    {user.skills.map((skill, i) => (
                      <tr>
                        <td>{i + 1}</td>
                        <td>{skill}</td>
                        <td>
                          <Button variant="outline-danger" type="submit">
                            Delete Entry
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Form>
                  <Row>
                    <Col xs={12} sm="auto">
                      <Form.Group controlId="skill">
                        <Form.Control placeholder="Skill" />
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
