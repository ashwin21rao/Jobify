import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import ApplicantNavbar from "./Navbar";
import { Container, Row, Col } from "react-bootstrap/";
import Form from "react-bootstrap/Form";
import MainHeading from "../../components/MainHeading";
import ModalWindow from "../../components/ModalWindow";
import FormatDate from "../../components/FormatDate";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

class MyApplications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: props.auth.user.userType === "applicant",
      fetching: true,
    };
  }

  componentDidMount() {
    // get jobs
    const { user } = this.props.auth;
    axios
      .post("/applicant/applications/load", {
        user_id: user.id,
      })
      .then((res) => {
        this.setState({
          applicationData: res.data,
          fetching: false,
        });
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
        <ApplicantNavbar />
        <Container fluid>
          <Row className="mt-3 mb-3">
            <Col xs={12}>
              <MainHeading heading="My Applications" />
            </Col>
          </Row>
          <Row>
            <Col>
              <Table striped bordered hover responsive="lg">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Recruiter Name</th>
                    <th>Company</th>
                    <th>Rating</th>
                    <th>Salary</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Date of Joining</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.applicationData.map((obj, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{obj.title}</td>
                      <td>{obj.recruiter_details.name}</td>
                      <td>{obj.recruiter_details.company}</td>
                      <td>{obj.rating}</td>
                      <td>{obj.salary}</td>
                      <td>{obj.job_type}</td>
                      <td>{`${obj.duration} months`}</td>
                      <td
                        className={
                          obj.applicant_details.status === "Accepted"
                            ? "text-success"
                            : obj.applicant_details.status === "Rejected"
                            ? "text-danger"
                            : obj.applicant_details.status === "Shortlisted"
                            ? "text-info"
                            : ""
                        }
                      >
                        {obj.applicant_details.status}
                      </td>
                      <td>
                        {obj.applicant_details.date_of_joining
                          ? FormatDate(
                              new Date(obj.applicant_details?.date_of_joining)
                            )
                          : ""}
                      </td>
                      <td>
                        <ModalWindow
                          formId="modalForm"
                          title="Rating"
                          buttonType={{
                            label: "Rate",
                            variant: "outline-info",
                          }}
                        >
                          <Form id="modalForm">
                            <Form.Group controlId="rating">
                              <Form.Control
                                type="number"
                                min="0"
                                max="5"
                                required
                              />
                            </Form.Group>
                          </Form>
                        </ModalWindow>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

MyApplications.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(MyApplications);
