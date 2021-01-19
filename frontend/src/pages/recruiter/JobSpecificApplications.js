import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Table from "react-bootstrap/Table";
import RecruiterNavbar from "./Navbar";
import { Container, Row, Col } from "react-bootstrap/";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import MainHeading from "../../components/MainHeading";
import FormatDate from "../../components/FormatDate";
import RoundNumber from "../../components/RoundNumber";
import DismissibleAlert from "../../components/Alert";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

class JobSpecificApplications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: props.auth.user.userType === "recruiter",
      fetching: true,
      filters: {
        sort_by: { value: "None", type: "Asc" },
      },
    };
    this.renderButton = this.renderButton.bind(this);
    this.changeStatus = this.changeStatus.bind(this);

    this.filterApplicants = this.filterApplicants.bind(this);
    this.sortApplicantsBy = this.sortApplicantsBy.bind(this);
    this.sortApplicantsType = this.sortApplicantsType.bind(this);

    this.alertIfFull = this.alertIfFull.bind(this);
  }

  componentDidMount() {
    const { jobData } = this.props.location;

    if (jobData) {
      axios
        .post("/recruiter/applications/load", {
          job_id: jobData._id,
        })
        .then((res) => {
          this.setState({
            applicantData: res.data,
            fetching: false,
            jobData: this.props.location.jobData,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  alertIfFull() {
    const { jobData } = this.state;

    if (jobData.positions_available === 0) {
      return (
        <DismissibleAlert variant="success" dismissible={false}>
          All positions filled up!
        </DismissibleAlert>
      );
    } else if (
      jobData.job_applicants.reduce(
        (acc, appl) =>
          appl.status !== "Accepted" && appl.status !== "Rejected"
            ? acc + 1
            : acc,
        0
      ) >= jobData.max_applicants
    ) {
      return (
        <DismissibleAlert variant="primary" dismissible={false}>
          Maximum applicants reached.
        </DismissibleAlert>
      );
    }
  }

  renderButton(appl) {
    const { status } = appl;

    const disabled = this.state.jobData.positions_available === 0;

    if (status === "Applied") {
      return (
        <Button
          variant="outline-info"
          className="mr-0 mr-md-2 mb-2 mb-md-0"
          onClick={(e) => this.changeStatus(e, appl, "Shortlisted")}
          disabled={disabled}
        >
          Shortlist
        </Button>
      );
    } else {
      return (
        <Button
          variant="outline-success"
          disabled={disabled || status === "Accepted"}
          className="mr-0 mr-md-2 mb-2 mb-md-0"
          onClick={(e) => this.changeStatus(e, appl, "Accepted")}
        >
          Accept
        </Button>
      );
    }
  }

  changeStatus(e, appl, newStatus) {
    e.preventDefault();
    const { jobData } = this.props.location;

    axios
      .post(
        `/recruiter/applications/${
          newStatus === "Accepted" ? "accept" : "changestatus"
        }`,
        {
          applicant_id: appl.applicant_id,
          job_id: jobData._id,
          status: newStatus,
        }
      )
      .then((res) => {
        this.setState((state) => ({
          applicantData: state.applicantData.map((obj) => {
            if (obj.user_id === appl.user_id)
              return { ...obj, status: newStatus };
            else return obj;
          }),
          jobData: res.data,
        }));
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
            (a.personal_data[sort_by.value] >= b.personal_data[sort_by.value]
              ? 1
              : -1)
        );
      } else if (sort_by.value === "date_of_application") {
        applicantData.sort(
          (a, b) =>
            sort_type *
            (new Date(a[sort_by.value]) - new Date(b[sort_by.value]))
        );
      }
    }

    return applicantData.filter((appl) => appl.status !== "Rejected");
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

    // redirect to dashboard if state is lost (on page refresh)
    if (!this.props.location.jobData) {
      return <Redirect to="/recruiter/dashboard" />;
    }

    if (this.state.fetching) {
      return <React.Fragment>Fetching data...</React.Fragment>;
    }

    return (
      <React.Fragment>
        <RecruiterNavbar />
        <Container fluid>
          <Row className="mt-3 mb-3">
            <Col>
              <MainHeading heading="Applications" />
              {this.alertIfFull()}
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
                        <option value="date_of_application">
                          Date of Application
                        </option>
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
                    <th>Skills</th>
                    <th>Education</th>
                    <th>Date of Application</th>
                    <th>SOP</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.filterApplicants().map((appl, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{appl.personal_data.name}</td>
                      <td>{appl.personal_data.skills.join(", ")}</td>
                      <td>
                        {appl.personal_data.education.map(
                          ({ institute_name, start_year, end_year }, j) => (
                            <div key={j} style={{ marginBottom: "0.5rem" }}>
                              {`${institute_name} (${start_year} - ${end_year})`}
                            </div>
                          )
                        )}
                      </td>
                      <td>{FormatDate(new Date(appl.date_of_application))}</td>
                      <td>{appl.sop}</td>
                      <td>{RoundNumber(appl.personal_data.rating, 2)}</td>
                      <td
                        className={
                          appl.status === "Accepted"
                            ? "text-success"
                            : appl.status === "Rejected"
                            ? "text-danger"
                            : appl.status === "Shortlisted"
                            ? "text-info"
                            : ""
                        }
                      >
                        {appl.status}
                      </td>
                      <td>
                        {this.renderButton(appl)}
                        <Button
                          variant="outline-danger"
                          disabled={appl.status === "Accepted"}
                          onClick={(e) =>
                            this.changeStatus(e, appl, "Rejected")
                          }
                        >
                          Reject
                        </Button>
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

JobSpecificApplications.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(JobSpecificApplications);
