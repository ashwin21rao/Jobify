import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import RecruiterNavbar from "./Navbar";
import { Container, Row, Col } from "react-bootstrap/";
import Button from "react-bootstrap/Button";
import MainHeading from "../../components/MainHeading";
import FormatDate from "../../components/FormatDate";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

class RecruiterDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: true,
      fetching: true,
    };
    this.passDataAndNavigate = this.passDataAndNavigate.bind(this);
    this.removeJob = this.removeJob.bind(this);
  }

  passDataAndNavigate(e, path, data) {
    e.stopPropagation();
    this.props.history.push({
      pathname: path,
      jobData: data,
    });
  }

  componentWillMount() {
    // applicant cannot view recruiter pages
    this.state.authorized = this.props.auth.user.userType === "recruiter";
  }

  componentDidMount() {
    const { user } = this.props.auth;
    axios
      .post("/recruiter/dashboard/load", { user_id: user.id })
      .then((res) => {
        this.setState({ jobData: res.data, fetching: false });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  removeJob(e, jobData) {
    e.stopPropagation();
    const { user } = this.props.auth;
    console.log(user);
    axios
      .post("/recruiter/dashboard/removejob", {
        user_id: user.id,
        job_id: jobData._id,
      })
      .then((res) => {
        console.log(res.data);
        this.setState({ jobData: res.data, fetching: false });
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
        <Container fluid>
          <Row className="mt-3 mb-3">
            <Col xs="auto">
              <MainHeading heading="Active Listings" />
            </Col>
            <Col xs="auto">
              <Button
                variant="success"
                style={{ marginTop: "0.35rem" }}
                onClick={(e) =>
                  this.passDataAndNavigate(
                    e,
                    "/recruiter/addlisting",
                    undefined
                  )
                }
              >
                Add New
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table striped bordered hover responsive="lg">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Date of Posting</th>
                    <th>Deadline</th>
                    <th>Max Applicants</th>
                    <th>Positions Available</th>
                    <th>Job Type</th>
                    <th>Duration</th>
                    <th>Skills Required</th>
                    <th>Salary</th>
                    <th>Rating</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.jobData.map((obj, i) => (
                    <tr
                      onClick={(e) =>
                        this.passDataAndNavigate(
                          e,
                          "/recruiter/applications",
                          obj
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      <td>{i + 1}</td>
                      <td>{obj.title}</td>
                      <td>{FormatDate(new Date(obj.date_of_posting))}</td>
                      <td>{FormatDate(new Date(obj.deadline))}</td>
                      <td>{obj.max_applicants}</td>
                      <td>{obj.positions_available}</td>
                      <td>{obj.job_type}</td>
                      <td>{obj.duration}</td>
                      <td>{obj.skills.join(", ")}</td>
                      <td>{obj.salary}</td>
                      <td>{obj.rating}</td>
                      <td>
                        <Button
                          variant="outline-info"
                          type="submit"
                          className="mr-0 mr-lg-2 mb-2 mb-lg-0"
                          onClick={(e) =>
                            this.passDataAndNavigate(
                              e,
                              "/recruiter/addlisting",
                              obj
                            )
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={(e) => {
                            this.removeJob(e, obj);
                          }}
                        >
                          Delete
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

RecruiterDashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(RecruiterDashboard);
