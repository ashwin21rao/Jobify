import React, { Component } from "react";
import ApplicantNavbar from "./Navbar";
import Form from "react-bootstrap/Form";
import { Container, Row, Col } from "react-bootstrap/";
import Button from "react-bootstrap/Button";
import MainHeading from "../../components/MainHeading";
import Table from "react-bootstrap/Table";
import FormatDate from "../../components/FormatDate";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

class AddListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: props.auth.user.userType === "recruiter",
      datePickerDate: props.location.jobData?.deadline ?? new Date(),
      skills: props.location.jobData?.skills ?? [],
    };

    this.addListing = this.addListing.bind(this);
    this.editListing = this.editListing.bind(this);
    this.handleDatePicker = this.handleDatePicker.bind(this);
    this.addSkill = this.addSkill.bind(this);
    this.removeSkill = this.removeSkill.bind(this);
  }

  editListing(e) {
    const { max_applicants, positions_available } = e.target.elements;
    const { jobData } = this.props.location;

    axios
      .post("/recruiter/joblisting/editlisting", {
        job_id: jobData._id,
        deadline: this.state.datePickerDate,
        max_applicants: max_applicants.value,
        positions_available: positions_available.value,
        skills: this.state.skills,
      })
      .then((res) => {
        this.props.history.push("/recruiter/dashboard/"); // go to dashboard
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  addListing(e) {
    e.preventDefault();

    if (this.props.location.jobData) {
      this.editListing(e);
      return;
    }

    const {
      title,
      job_type,
      max_applicants,
      positions_available,
      duration,
      salary,
    } = e.target.elements;
    const { user } = this.props.auth;

    axios
      .post("/recruiter/joblisting/addlisting", {
        user_id: user.id,
        title: title.value,
        job_type: job_type.value,
        date_of_posting: new Date(),
        deadline: this.state.datePickerDate,
        max_applicants: max_applicants.value,
        positions_available: positions_available.value,
        duration: duration.value,
        salary: salary.value,
        rating: 0,
        skills: this.state.skills,
      })
      .then((res) => {
        this.props.history.push("/recruiter/dashboard/"); // go to dashboard
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleDatePicker = (date) => {
    this.setState({ datePickerDate: date });
  };

  addSkill(e) {
    e.preventDefault();
    this.setState({
      skills: [...new Set([...this.state.skills, e.target.skill.value])],
    });
    e.target.skill.value = "";
  }

  removeSkill(skill) {
    let new_skills = this.state.skills.slice();
    new_skills.splice(new_skills.indexOf(skill), 1);
    this.setState({ skills: new_skills });
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
              <Form onSubmit={this.addListing} id="add_listing_form">
                <Row>
                  <Col xs={12} sm={4}>
                    <Form.Group controlId="title">
                      <Form.Label>Job Title</Form.Label>
                      <Form.Control
                        defaultValue={jobData?.title}
                        disabled={Boolean(jobData)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={4}>
                    <Form.Group controlId="job_type">
                      <Form.Label>Sort by</Form.Label>
                      <Form.Control
                        as="select"
                        custom
                        disabled={Boolean(jobData)}
                        required
                      >
                        <option value="Full time">Full time</option>
                        <option value="Part time">Part time</option>
                        <option value="Work from home">Work from home</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={4}>
                    <Form.Group controlId="date_of_posting">
                      <Form.Label>Date of Posting</Form.Label>
                      <Form.Control
                        defaultValue={FormatDate(
                          new Date(jobData?.date_of_posting ?? Date.now())
                        )}
                        disabled
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={4}>
                    <Form.Label>Deadline</Form.Label>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDateTimePicker
                        // disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy HH:mm"
                        margin="normal"
                        name="deadline"
                        value={this.state.datePickerDate}
                        onChange={this.handleDatePicker}
                        style={{ marginTop: "0.3rem" }}
                        fullWidth={true}
                        required
                        disablePast
                      />
                    </MuiPickersUtilsProvider>
                  </Col>
                  <Col xs={12} sm={4}>
                    <Form.Group controlId="max_applicants">
                      <Form.Label>Maximum Applicants</Form.Label>
                      <Form.Control
                        defaultValue={jobData?.max_applicants}
                        required
                        type="number"
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={4}>
                    <Form.Group controlId="positions_available">
                      <Form.Label>Positions Available</Form.Label>
                      <Form.Control
                        defaultValue={jobData?.positions_available}
                        required
                        type="number"
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={4}>
                    <Form.Group controlId="duration">
                      <Form.Label>Duration (months)</Form.Label>
                      <Form.Control
                        defaultValue={jobData?.duration}
                        disabled={Boolean(jobData)}
                        type="number"
                        min="0"
                        max="6"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={4}>
                    <Form.Group controlId="salary">
                      <Form.Label>Salary</Form.Label>
                      <Form.Control
                        defaultValue={jobData?.salary}
                        disabled={Boolean(jobData)}
                        required
                        type="number"
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={4}>
                    <Form.Group controlId="rating">
                      <Form.Label>Rating</Form.Label>
                      <Form.Control
                        defaultValue={jobData?.rating ?? 0}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
              <Row className="mb-3">
                <Col>
                  <div className="skills_container">
                    <Form.Label>Required Skills</Form.Label>
                    <Table striped bordered hover responsive="lg">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Skill</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.skills.map((skill, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{skill}</td>
                            <td>
                              <Button
                                variant="outline-danger"
                                type="submit"
                                onClick={(e) => this.removeSkill(skill)}
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
              <Row>
                <Col>
                  <Button
                    form="add_listing_form"
                    variant="success"
                    type="submit"
                    className="mt-2"
                  >
                    {`${jobData ? "Edit" : "Add"} listing`}
                  </Button>
                </Col>
              </Row>
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
