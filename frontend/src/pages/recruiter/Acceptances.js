import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import RecruiterNavbar from "./Navbar";
import { Container, Row, Col } from "react-bootstrap/";
import Form from "react-bootstrap/Form";
import MainHeading from "../../components/MainHeading";
import ModalWindow from "../../components/ModalWindow";
import FormatDate from "../../components/FormatDate";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

class AcceptedEmployees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: props.auth.user.userType === "recruiter",
      fetching: true,
      filters: {
        sort_by: { value: "None", type: "Asc" },
      },
    };

    this.filterApplicants = this.filterApplicants.bind(this);
    this.sortApplicantsBy = this.sortApplicantsBy.bind(this);
    this.sortApplicantsType = this.sortApplicantsType.bind(this);
  }

  componentDidMount() {
    const { user } = this.props.auth;

    axios
      .post("/recruiter/acceptances/load", {
        user_id: user.id,
      })
      .then((res) => {
        this.setState({
          applicantData: res.data,
          fetching: false,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // FRONTEND FILTERING, SORTING, SEARCHING
  filterApplicants() {
    const { sort_by } = this.state.filters;

    let applicantData = this.state.applicantData.slice();
    if (sort_by.value !== "None") {
      const sort_type = sort_by.type === "Asc" ? 1 : -1;

      if (sort_by.value === "name" || sort_by.value === "rating") {
        applicantData.sort(
          (a, b) =>
            sort_type *
            (a.applicant_details.personal_data[sort_by.value] >=
            b.applicant_details.personal_data[sort_by.value]
              ? 1
              : -1)
        );
      } else if (sort_by.value === "date_of_joining") {
        applicantData.sort(
          (a, b) =>
            sort_type *
            (new Date(a.applicant_details[sort_by.value]) -
              new Date(b.applicant_details[sort_by.value]))
        );
      } else if (sort_by.value === "title") {
        applicantData.sort(
          (a, b) => sort_type * (a[sort_by.value] > b[sort_by.value] ? 1 : -1)
        );
      }
    }

    return applicantData;
  }

  sortApplicantsBy(e) {
    const { value } = e.target;
    this.setState({
      filters: {
        ...this.state.filters,
        sort_by: { ...this.state.filters.sort_by, value },
      },
    });
  }

  sortApplicantsType(e) {
    const { checked } = e.target;
    this.setState({
      filters: {
        ...this.state.filters,
        sort_by: {
          ...this.state.filters.sort_by,
          type: checked ? "Desc" : "Asc",
        },
      },
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
            <Col>
              <MainHeading heading="Accepted Employees" />
            </Col>
          </Row>
          <Row className="mt-3 mb-3">
            <Col>
              <Form>
                <Row className="align-items-center">
                  <Col xs="auto">
                    <Form.Group controlId="sortBy">
                      <Form.Label>Sort by</Form.Label>
                      <Form.Control
                        as="select"
                        custom
                        onChange={this.sortApplicantsBy}
                      >
                        <option value="None">None</option>
                        <option value="name">Name</option>
                        <option value="title">Job Title</option>
                        <option value="date_of_joining">Date of Joining</option>
                        <option value="rating">Rating</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col xs="auto">
                    <Form.Group controlId="sortType">
                      <Form.Check
                        custom
                        label="Desc"
                        className="mt-4"
                        onChange={this.sortApplicantsType}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table striped bordered hover responsive="lg">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Job Title</th>
                    <th>Date of Joining</th>
                    <th>Job Type</th>
                    <th>Employee Rating</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.filterApplicants().map((appl, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{appl.applicant_details.personal_data.name}</td>
                      <td>{appl.title}</td>
                      <td>
                        {FormatDate(
                          new Date(appl.applicant_details.date_of_joining)
                        )}
                      </td>
                      <td>{appl.job_type}</td>
                      <td>{appl.applicant_details.personal_data.rating}</td>
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

AcceptedEmployees.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(AcceptedEmployees);
