import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import RecruiterNavbar from "./Navbar";
import { Container, Row, Col } from "react-bootstrap/";
import Button from "react-bootstrap/Button";
import MainHeading from "../../components/MainHeading";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

class RecruiterProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: true,
      fetching: true,
    };
    this.updateProfile = this.updateProfile.bind(this);
  }

  componentWillMount() {
    // applicant cannot view recruiter pages
    this.state.authorized = this.props.auth.user.userType === "recruiter";
  }

  componentDidMount() {
    // get recuiter profile
    const { user } = this.props.auth;
    axios
      .post("/recruiter/profile/load", {
        user_id: user.id,
      })
      .then((res) => {
        this.setState({ profileData: res.data, fetching: false });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  updateProfile(e) {
    e.preventDefault();
    const { phone_number, bio } = e.target.elements;
    const { user } = this.props.auth;

    console.log(e.target.elements);
    axios
      .post("/recruiter/profile/update", {
        user_id: user.id,
        phone_number: phone_number?.value,
        bio: bio?.value,
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

    return (
      <React.Fragment>
        <RecruiterNavbar />
        <Container fluid="lg">
          <Row className="mt-3 mb-3">
            <Col xs={12}>
              <MainHeading heading="My Profile" />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form onSubmit={this.updateProfile}>
                <Row>
                  <Col xs={12} md={4}>
                    <Form.Group controlId="detailsName">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        defaultValue={this.state.profileData.name}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={4}>
                    <Form.Group controlId="detailsEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        defaultValue={this.state.profileData.email}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={4}>
                    <Form.Group controlId="phone_number">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        defaultValue={this.state.profileData.phone_number}
                        type="number"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={12}>
                    <Form.Group controlId="bio">
                      <Form.Label>Bio</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        defaultValue={this.state.profileData.bio}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col sm={12} sm="auto">
                    <Button variant="success" type="submit">
                      Update details
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

RecruiterProfile.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(RecruiterProfile);
