import React, { Component } from "react";
import ApplicantNavbar from "./Navbar";
import Form from "react-bootstrap/Form";
import { Container, Row, Col } from "react-bootstrap/";
import Button from "react-bootstrap/Button";
import MainHeading from "../../components/MainHeading";

import { connect } from "react-redux";
import PropTypes from "prop-types";

class AddListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: true,
    };
  }

  componentWillMount() {
    // applicant cannot view recruiter pages
    this.state.authorized = this.props.auth.user.userType === "recruiter";
  }

  render() {
    const { jobData } = this.props.location;

    if (!this.state.authorized) {
      this.props.history.goBack();
      return <></>;
    }

    return (
      <React.Fragment>
        <ApplicantNavbar />
        <Container fluid="md">
          <Row className="mt-3 mb-3">
            <Col>
              <MainHeading heading={`${jobData ? "Edit" : "Add"} listing`} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form>
                <Row>
                  <Col xs={12} sm={6}>
                    <Form.Group controlId="recruiterName">
                      <Form.Label>Recruiter Name</Form.Label>
                      <Form.Control
                        defaultValue={jobData?.recruiterName}
                        disabled={Boolean(jobData)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Form.Group controlId="recruiterEmail">
                      <Form.Label>Recruiter Email</Form.Label>
                      <Form.Control
                        defaultValue={jobData?.recruiterEmail}
                        disabled={Boolean(jobData)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={4}>
                    <Form.Group controlId="title">
                      <Form.Label>Job Title</Form.Label>
                      <Form.Control
                        defaultValue={jobData?.title}
                        disabled={Boolean(jobData)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={4}>
                    <Form.Group controlId="company">
                      <Form.Label>Company</Form.Label>
                      <Form.Control
                        defaultValue={jobData?.company}
                        disabled={Boolean(jobData)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={4}>
                    <Form.Group controlId="dateOfPosting">
                      <Form.Label>Date of Posting</Form.Label>
                      <Form.Control
                        defaultValue={jobData?.dateOfPosting}
                        disabled={Boolean(jobData)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={4}>
                    <Form.Group controlId="deadline">
                      <Form.Label>Deadline</Form.Label>
                      <Form.Control defaultValue={jobData?.deadline} />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={4}>
                    <Form.Group controlId="maxApplicants">
                      <Form.Label>Maximum Applicants</Form.Label>
                      <Form.Control defaultValue={jobData?.maxApplicants} />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={4}>
                    <Form.Group controlId="positionsAvailable">
                      <Form.Label>Positions Available</Form.Label>
                      <Form.Control
                        defaultValue={jobData?.positionsAvailable}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={4}>
                    <Form.Group controlId="duration">
                      <Form.Label>Duration</Form.Label>
                      <Form.Control
                        defaultValue={jobData?.duration}
                        disabled={Boolean(jobData)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={4}>
                    <Form.Group controlId="salary">
                      <Form.Label>Salary</Form.Label>
                      <Form.Control
                        defaultValue={jobData?.salary}
                        disabled={Boolean(jobData)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={4}>
                    <Form.Group controlId="rating">
                      <Form.Label>Rating</Form.Label>
                      <Form.Control
                        defaultValue={jobData?.rating}
                        disabled={Boolean(jobData)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="skills">
                      <Form.Label>Required Skills (comma separated)</Form.Label>
                      <Form.Control
                        defaultValue={jobData?.skills.join(", ")}
                        disabled={Boolean(jobData)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button variant="success" type="submit" className="mt-2">
                      {`${jobData ? "Edit" : "Add"} listing`}
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

AddListing.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(AddListing);
