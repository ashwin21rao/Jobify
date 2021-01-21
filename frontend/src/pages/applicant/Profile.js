import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import ApplicantNavbar from "./Navbar";
import { Container, Row, Col } from "react-bootstrap/";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import MainHeading from "../../components/MainHeading";
import RoundNumber from "../../components/RoundNumber";
import { Formik } from "formik";
import * as yup from "yup";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

class ApplicantProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: props.auth.user.userType === "applicant",
      fetching: true,
      submitted: false,
    };
    this.addEducation = this.addEducation.bind(this);
    this.removeEducation = this.removeEducation.bind(this);
    this.addSkill = this.addSkill.bind(this);
    this.removeSkill = this.removeSkill.bind(this);
    this.updateDetails = this.updateDetails.bind(this);
    this.showAlert = this.showAlert.bind(this);

    this.initializeSchema = this.initializeSchema.bind(this);
    this.personalSchema = {};
    this.educationSchema = {};
    this.skillsSchema = {};
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

  async addEducation(values, resetForm) {
    if (await this.educationSchema.validate(values)) {
      const { institute_name, start_year, end_year } = values;
      const { user } = this.props.auth;
      axios
        .post("/applicant/profile/addeducation", {
          user_id: user.id,
          institute_name,
          start_year,
          end_year: end_year ?? "",
        })
        .then((res) => {
          this.setState({ profileData: res.data });
          resetForm();
        })
        .catch(function (error) {
          console.log(error);
        });
    }
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

  async addSkill(values, resetForm) {
    if (await this.skillsSchema.validate(values)) {
      const { user } = this.props.auth;
      axios
        .post("/applicant/profile/addskill", {
          user_id: user.id,
          skill: values.skill,
        })
        .then((res) => {
          this.setState({ profileData: res.data });
          resetForm();
        })
        .catch(function (error) {
          console.log(error);
        });
    }
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

  async updateDetails(values) {
    if (await this.personalSchema.validate(values)) {
      const { user } = this.props.auth;
      axios
        .post("/applicant/profile/updatedetails", {
          user_id: user.id,
          name: values.name,
        })
        .then((res) => {
          this.setState({ profileData: res.data, submitted: true });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  showAlert() {
    if (this.state.submitted) {
      return (
        <Alert
          variant="success"
          onClose={() => this.setState({ submitted: false })}
          dismissible
        >
          Profile updated successfully
        </Alert>
      );
    }
    return <></>;
  }

  initializeSchema() {
    this.personalSchema = yup.object({
      name: yup
        .string()
        .required("Name is required")
        .matches(/^[A-Za-z ]+$/, "Name can only contain letters and spaces"),
    });

    this.educationSchema = yup.object({
      institute_name: yup.string().required("Institute name is required"),
      start_year: yup
        .number()
        .required("Start year is required")
        .min(new Date().getFullYear() - 50, "Please enter a valid start year")
        .max(new Date().getFullYear() + 20, "Please enter a valid start year"),
      end_year: yup
        .number()
        .min(new Date().getFullYear() - 50, "Please enter a valid end year")
        .max(new Date().getFullYear() + 20, "Please enter a valid end year")
        .test(
          "test_end_year",
          "End year cannot be less than start year",
          function (end_year) {
            return end_year ? end_year >= (this.parent.start_year ?? 0) : true;
          }
        ),
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

    if (this.state.fetching) {
      return <React.Fragment>Fetching data...</React.Fragment>;
    }

    const { profileData } = this.state;
    this.initializeSchema();

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

              <Formik
                validationSchema={this.personalSchema}
                onSubmit={this.updateDetails}
                initialValues={{
                  name: this.state.profileData.name,
                  email: profileData.email,
                  rating: RoundNumber(profileData.rating, 2),
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
                      <Col xs={12} md={4}>
                        <Form.Group controlId="name">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            required
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={errors.name}
                            isValid={touched.name && !errors.name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={4}>
                        <Form.Group controlId="email">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={values.email}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      <Col sm={12} md={4}>
                        <Form.Group controlId="rating">
                          <Form.Label>Rating</Form.Label>
                          <Form.Control
                            name="rating"
                            value={values.rating}
                            disabled
                          />
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
                )}
              </Formik>
            </Col>
          </Row>
          {this.showAlert()}
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
                      <tr key={i}>
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

                <Formik
                  validationSchema={this.educationSchema}
                  onSubmit={(values, { resetForm }) =>
                    this.addEducation(values, resetForm)
                  }
                  initialValues={{
                    institute_name: "",
                    start_year: "",
                    end_year: "",
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
                        <Col xs={12} sm={4} md="auto">
                          <Form.Group controlId="institute_name">
                            <Form.Control
                              required
                              placeholder="Institute Name"
                              name="institute_name"
                              value={values.institute_name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={
                                touched.institute_name && errors.institute_name
                              }
                              isValid={
                                touched.institute_name && !errors.institute_name
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.institute_name}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={4} md="auto">
                          <Form.Group controlId="start_year">
                            <Form.Control
                              required
                              placeholder="Start Year"
                              type="number"
                              name="start_year"
                              value={values.start_year}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={
                                touched.start_year && errors.start_year
                              }
                              isValid={touched.start_year && !errors.start_year}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.start_year}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={4} md="auto">
                          <Form.Group controlId="end_year">
                            <Form.Control
                              placeholder="End Year"
                              type="number"
                              name="end_year"
                              value={values.end_year}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.end_year && errors.end_year}
                              isValid={touched.end_year && !errors.end_year}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.end_year}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm="auto">
                          <Button variant="outline-success" type="submit">
                            Add entry
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </Formik>
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
                      <tr key={i}>
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
