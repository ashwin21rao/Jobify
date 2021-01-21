import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import RecruiterNavbar from "./Navbar";
import { Container, Row, Col } from "react-bootstrap/";
import Button from "react-bootstrap/Button";
import MainHeading from "../../components/MainHeading";
import Alert from "react-bootstrap/Alert";
import { Formik } from "formik";
import * as yup from "yup";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

class RecruiterProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: props.auth.user.userType === "recruiter",
      fetching: true,
      submitted: false,
    };
    this.updateProfile = this.updateProfile.bind(this);
    this.showAlert = this.showAlert.bind(this);

    this.initializeSchema = this.initializeSchema.bind(this);
    this.schema = {};
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

  async updateProfile(values) {
    if (await this.schema.validate(values)) {
      const { name, phone_number, company, bio } = values;

      const { user } = this.props.auth;
      axios
        .post("/recruiter/profile/update", {
          user_id: user.id,
          name: name ?? "",
          company: company ?? "",
          phone_number: phone_number ?? "",
          bio: bio ?? "",
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
    this.schema = yup.object({
      name: yup
        .string()
        .required("Name is required")
        .matches(/^[A-Za-z ]+$/, "Name can only contain letters and spaces"),
      phone_number: yup
        .string()
        .matches(/^[0-9]*$/, {
          message: "Phone number can only contain digits from 0-9",
          excludeEmptyString: true,
        })
        .matches(/^[0-9]{5,15}$/, {
          message: "Please enter a valid phone number",
          excludeEmptyString: true,
        }),
      bio: yup.string().matches(/^\s*\S+(?:\s+\S+){0,249}\s*$/, {
        message: "Bio must not exceed 250 words",
        excludeEmptyString: true,
      }),
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

    this.initializeSchema();

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
              <Formik
                validationSchema={this.schema}
                onSubmit={this.updateProfile}
                initialValues={{
                  name: this.state.profileData.name,
                  email: this.state.profileData.email,
                  phone_number: this.state.profileData.phone_number,
                  company: this.state.profileData.company,
                  bio: this.state.profileData.bio,
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
                      <Col xs={12} md={6}>
                        <Form.Group controlId="name">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            name="name"
                            required
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
                      <Col sm={12} md={6}>
                        <Form.Group controlId="email">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            disabled
                            value={values.email}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12} md={6}>
                        <Form.Group controlId="phone_number">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            name="phone_number"
                            value={values.phone_number}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={errors.phone_number}
                            isValid={
                              touched.phone_number && !errors.phone_number
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.phone_number}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col xs={12} md={6}>
                        <Form.Group controlId="company">
                          <Form.Label>Company</Form.Label>
                          <Form.Control
                            name="company"
                            value={values.company}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={errors.company}
                            isValid={touched.company && !errors.company}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.company}
                          </Form.Control.Feedback>
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
                            name="bio"
                            value={values.bio}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={errors.bio}
                            isValid={touched.bio && !errors.bio}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.bio}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col sm="auto">
                        <Button variant="success" type="submit">
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
