import React, { Component } from "react";
import ApplicantNavbar from "./Navbar";
import Form from "react-bootstrap/Form";
import { Container, Row, Col } from "react-bootstrap/";
import Button from "react-bootstrap/Button";
import MainHeading from "../../components/MainHeading";
import Table from "react-bootstrap/Table";
import FormatDate from "../../components/FormatDate";
import RoundNumber from "../../components/RoundNumber";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import "date-fns";
import addYears from "date-fns/addYears";
import DateFnsUtils from "@date-io/date-fns";
import { Formik } from "formik";
import * as yup from "yup";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

class AddListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: props.auth.user.userType === "recruiter",
      skills: props.location.jobData?.skills ?? [],
    };

    this.addListing = this.addListing.bind(this);
    this.editListing = this.editListing.bind(this);
    this.addSkill = this.addSkill.bind(this);
    this.removeSkill = this.removeSkill.bind(this);

    this.initializeSchema = this.initializeSchema.bind(this);
    this.listingSchema = {};
    this.skillsSchema = {};
  }

  async editListing(values) {
    if (await this.listingSchema.validate(values)) {
      const { deadline, max_applicants, positions_available } = values;
      const { jobData } = this.props.location;

      axios
        .post("/recruiter/joblisting/editlisting", {
          job_id: jobData._id,
          deadline,
          max_applicants,
          positions_available,
          skills: this.state.skills,
        })
        .then((res) => {
          this.props.history.push("/recruiter/dashboard/"); // go to dashboard
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  async addListing(values) {
    if (this.props.location.jobData) {
      this.editListing(values);
      return;
    }

    if (await this.listingSchema.validate(values)) {
      const {
        title,
        job_type,
        deadline,
        max_applicants,
        positions_available,
        duration,
        salary,
      } = values;
      const { user } = this.props.auth;
      axios
        .post("/recruiter/joblisting/addlisting", {
          user_id: user.id,
          title,
          job_type,
          date_of_posting: new Date(),
          deadline: deadline ?? new Date(),
          max_applicants,
          positions_available,
          duration,
          salary,
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
  }

  async addSkill(values, resetForm) {
    if (await this.skillsSchema.validate(values)) {
      this.setState({
        skills: [...new Set([...this.state.skills, values.skill])],
      });
      resetForm();
    }
  }

  removeSkill(skill) {
    let new_skills = this.state.skills.slice();
    new_skills.splice(new_skills.indexOf(skill), 1);
    this.setState({ skills: new_skills });
  }

  initializeSchema() {
    this.listingSchema = yup.object({
      title: yup.string().required("Job title is required"),
      deadline: yup
        .date()
        .required("This field is required")
        .typeError("Invalid date")
        .max(
          addYears(new Date(), 5),
          "Deadline must be less than 5 years away"
        ),
      max_applicants: yup
        .number()
        .required("This field is required")
        .min(0, "Maximum applicants cannot be negative")
        .max(1000, "Please enter a valid number"),
      positions_available: yup
        .number()
        .required("This field is required")
        .min(0, "Positions available cannot be negative")
        .max(1000, "Please enter a valid number"),
      duration: yup
        .number()
        .required("This field is required")
        .min(0, "Duration must be between 0 and 6 months")
        .max(6, "Duration must be between 0 and 6 months"),
      salary: yup
        .number()
        .required("This field is required")
        .min(0, "Salary cannot be negative")
        .max(999999999, "Please enter a valid salary"),
    });

    this.skillsSchema = yup.object({
      skill: yup.string().required("Skill is required"),
    });
  }

  render() {
    if (!this.state.authorized) {
      this.props.history.goBack();
      return <></>;
    }

    const { jobData } = this.props.location;
    this.initializeSchema();

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
              <Formik
                validationSchema={this.listingSchema}
                onSubmit={this.addListing}
                initialValues={{
                  title: jobData?.title ?? "",
                  job_type: jobData?.job_type ?? "Full time",
                  date_of_posting: FormatDate(
                    new Date(jobData?.date_of_posting ?? Date.now())
                  ),
                  deadline: jobData?.deadline ?? new Date(),
                  max_applicants: jobData?.max_applicants ?? "",
                  positions_available: jobData?.positions_available ?? "",
                  duration: jobData?.duration ?? "",
                  salary: jobData?.salary ?? "",
                  rating: jobData ? RoundNumber(jobData.rating, 2) : 0,
                }}
              >
                {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  setFieldValue,
                  values,
                  touched,
                  errors,
                }) => (
                  <Form
                    noValidate
                    onSubmit={handleSubmit}
                    id="add_listing_form"
                  >
                    <Row>
                      <Col xs={12} sm={4}>
                        <Form.Group controlId="title">
                          <Form.Label>Job Title</Form.Label>
                          <Form.Control
                            disabled={Boolean(jobData)}
                            required
                            name="title"
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.title && errors.title}
                            isValid={touched.title && !errors.title}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.title}
                          </Form.Control.Feedback>
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
                            name="job_type"
                            value={values.job_type}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.job_type && errors.job_type}
                            isValid={touched.job_type && !errors.job_type}
                          >
                            <option value="Full time">Full time</option>
                            <option value="Part time">Part time</option>
                            <option value="Work from home">
                              Work from home
                            </option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={4}>
                        <Form.Group controlId="date_of_posting">
                          <Form.Label>Date of Posting</Form.Label>
                          <Form.Control
                            disabled
                            required
                            name="date_of_posting"
                            value={values.date_of_posting}
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
                            style={{ marginTop: "0.3rem" }}
                            fullWidth={true}
                            disablePast
                            required
                            name="deadline"
                            value={values.deadline}
                            onChange={(value) =>
                              setFieldValue("deadline", value)
                            }
                            error={Boolean(errors.deadline)}
                            helperText={errors.deadline}
                          />
                        </MuiPickersUtilsProvider>
                      </Col>
                      <Col xs={12} sm={4}>
                        <Form.Group controlId="max_applicants">
                          <Form.Label>Maximum Applicants</Form.Label>
                          <Form.Control
                            required
                            type="number"
                            name="max_applicants"
                            value={values.max_applicants}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.max_applicants && errors.max_applicants
                            }
                            isValid={
                              touched.max_applicants && !errors.max_applicants
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.max_applicants}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={4}>
                        <Form.Group controlId="positions_available">
                          <Form.Label>Positions Available</Form.Label>
                          <Form.Control
                            required
                            type="number"
                            name="positions_available"
                            value={values.positions_available}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                              touched.positions_available &&
                              errors.positions_available
                            }
                            isValid={
                              touched.positions_available &&
                              !errors.positions_available
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.positions_available}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} sm={4}>
                        <Form.Group controlId="duration">
                          <Form.Label>Duration (months)</Form.Label>
                          <Form.Control
                            disabled={Boolean(jobData)}
                            required
                            type="number"
                            name="duration"
                            value={values.duration}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.duration && errors.duration}
                            isValid={touched.duration && !errors.duration}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.duration}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={4}>
                        <Form.Group controlId="salary">
                          <Form.Label>Salary</Form.Label>
                          <Form.Control
                            disabled={Boolean(jobData)}
                            required
                            type="number"
                            name="salary"
                            value={values.salary}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.salary && errors.salary}
                            isValid={touched.salary && !errors.salary}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.salary}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={4}>
                        <Form.Group controlId="rating">
                          <Form.Label>Rating</Form.Label>
                          <Form.Control
                            name="rating"
                            disabled
                            value={values.rating}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
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
                    <Formik
                      validationSchema={this.skillsSchema}
                      onSubmit={(values, { resetForm }) =>
                        this.addSkill(values, resetForm)
                      }
                      initialValues={{
                        skill: "",
                      }}
                    >
                      {({
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        values,
                        touched,
                        errors,
                      }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                          <Row>
                            <Col xs={12} sm="auto">
                              <Form.Group controlId="skill">
                                <Form.Control
                                  required
                                  placeholder="Skill"
                                  name="skill"
                                  value={values.skill}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  isInvalid={errors.skill}
                                  isValid={touched.skill && !errors.skill}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.skill}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col xs={12} sm="auto">
                              <Button variant="outline-success" type="submit">
                                Add skill
                              </Button>
                            </Col>
                          </Row>
                        </Form>
                      )}
                    </Formik>
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
