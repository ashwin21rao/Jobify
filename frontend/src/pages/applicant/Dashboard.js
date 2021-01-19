import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import ApplicantNavbar from "./Navbar";
import Form from "react-bootstrap/Form";
import { Container, Row, Col } from "react-bootstrap/";
import MainHeading from "../../components/MainHeading";
import ApplyModalWindow from "../../components/ApplyModalWindow";
import formatDate from "../../components/FormatDate";
import RoundNumber from "../../components/RoundNumber";
import DismissibleAlert from "../../components/Alert";
import Fuse from "fuse.js";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";

class ApplicantDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: props.auth.user.userType === "applicant",
      fetching: true,
      filters: {
        job_type: "All",
        duration: "All",
        sort_by: { value: "None", type: "Asc" },
        min_salary: "",
        max_salary: "",
        search_string: "",
        show_applied: true,
      },
      can_apply: true,
    };
    this.applyToJob = this.applyToJob.bind(this);

    this.checkOutstandingApplications = this.checkOutstandingApplications.bind(
      this
    );
    this.alertIfTooManyApplications = this.alertIfTooManyApplications.bind(
      this
    );

    this.filterjobs = this.filterJobs.bind(this);
    this.filter = this.filter.bind(this);
    this.sortJobsBy = this.sortJobsBy.bind(this);
    this.sortJobsType = this.sortJobsType.bind(this);
    this.filterAppliedJobs = this.filterAppliedJobs.bind(this);
  }

  componentDidMount() {
    // get jobs
    const { user } = this.props.auth;
    axios
      .post("/applicant/dashboard/load", {
        user_id: user.id,
      })
      .then((res) => {
        this.setState({
          original_jobData: res.data.jobData,
          jobData: res.data.jobData,
          jobsApplied: res.data.jobsApplied,
          fetching: false,
        });
        this.checkOutstandingApplications();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  applyToJob(sop, jobData) {
    const { user } = this.props.auth;

    axios
      .post("/applicant/dashboard/apply", {
        user_id: user.id,
        job_id: jobData._id,
        date_of_application: new Date(),
        sop,
      })
      .then((res) => {
        this.setState({
          jobsApplied: res.data.jobsApplied,
        });
        this.checkOutstandingApplications();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  checkOutstandingApplications() {
    const { user } = this.props.auth;

    axios
      .post("/applicant/dashboard/outstandingapplications", {
        user_id: user.id,
      })
      .then((res) => {
        this.setState({
          can_apply: res.data.outstanding_applications < 10,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  alertIfTooManyApplications() {
    if (!this.state.can_apply) {
      return (
        <DismissibleAlert variant="primary" dismissible={false}>
          You have reached the maximum number of outstanding applications.
        </DismissibleAlert>
      );
    }
  }

  // FRONTEND FILTERING, SORTING, SEARCHING
  filterJobs() {
    const {
      job_type,
      duration,
      sort_by,
      min_salary,
      max_salary,
      search_string,
      show_applied,
    } = this.state.filters;

    let jobData = this.state.jobData.slice();

    const fuse = new Fuse(jobData, {
      keys: ["title"],
    });
    jobData = search_string
      ? fuse.search(search_string).map((job) => job.item)
      : jobData;

    if (sort_by.value !== "None") {
      if (sort_by.type === "Asc")
        jobData.sort((a, b) => a[sort_by.value] - b[sort_by.value]);
      else jobData.sort((a, b) => b[sort_by.value] - a[sort_by.value]);
    }

    return jobData.filter((job) => {
      const job_type_cond =
        job_type === "All" ? true : job.job_type === job_type;

      const duration_cond =
        duration === "All"
          ? true
          : +job.duration < +duration && +job.duration > 0;

      const min_salary_cond =
        min_salary === "" ? true : +min_salary <= +job.salary;

      const max_salary_cond =
        max_salary === "" ? true : +max_salary >= +job.salary;

      const applied_cond = show_applied
        ? true
        : !this.state.jobsApplied.includes(job._id);

      return (
        new Date(job.deadline) - Date.now() > 0 &&
        job_type_cond &&
        min_salary_cond &&
        max_salary_cond &&
        duration_cond &&
        applied_cond
      );
    });
  }

  filter(e) {
    const { name, value } = e.target;
    this.setState({
      filters: { ...this.state.filters, [name]: value },
    });
  }

  sortJobsBy(e) {
    const { value } = e.target;
    this.setState({
      filters: {
        ...this.state.filters,
        sort_by: { ...this.state.filters.sort_by, value },
      },
    });
  }

  sortJobsType(e) {
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

  filterAppliedJobs(e) {
    const { checked } = e.target;
    this.setState({
      filters: {
        ...this.state.filters,
        show_applied: checked,
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
        <ApplicantNavbar />
        <Container fluid>
          <Row className="mt-3 mb-3">
            <Col>
              <MainHeading heading="Job Listings" />
              {this.alertIfTooManyApplications()}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={12} lg={3}>
              <Container>
                <Row className="mb-1">
                  <Col xs={12}>
                    <Form className="border-bottom">
                      <Form.Group controlId="searchtext">
                        <Form.Label>Search by title</Form.Label>
                        <Form.Control
                          name="search_string"
                          onChange={this.filter}
                        />
                      </Form.Group>
                    </Form>
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Col>
                    <Form className="border-bottom">
                      <Form.Group controlId="jobtype">
                        <Form.Label>Job type</Form.Label>
                        <Form.Control
                          as="select"
                          custom
                          name="job_type"
                          onChange={this.filter}
                        >
                          <option value="All">All</option>
                          <option value="Full time">Full time</option>
                          <option value="Part time">Part time</option>
                          <option value="Work from home">Work from home</option>
                        </Form.Control>
                      </Form.Group>
                    </Form>
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Col>
                    <Form className="border-bottom">
                      <Row>
                        <Col>
                          <Form.Group controlId="minsalary">
                            <Form.Label>Min salary</Form.Label>
                            <Form.Control
                              name="min_salary"
                              type="number"
                              onChange={this.filter}
                            />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="maxsalary">
                            <Form.Label>Max salary</Form.Label>
                            <Form.Control
                              name="max_salary"
                              type="number"
                              onChange={this.filter}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Col>
                    <Form className="border-bottom">
                      <Form.Group controlId="duration">
                        <Form.Label>Duration (months)</Form.Label>
                        <Form.Control
                          as="select"
                          custom
                          name="duration"
                          onChange={this.filter}
                        >
                          <option value="All">All</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                        </Form.Control>
                      </Form.Group>
                    </Form>
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Col>
                    <Form className="border-bottom">
                      <Row className="align-items-center">
                        <Col xs={12} sm={6}>
                          <Form.Group controlId="sortBy">
                            <Form.Label>Sort by</Form.Label>
                            <Form.Control
                              as="select"
                              custom
                              onChange={this.sortJobsBy}
                            >
                              <option value="None">None</option>
                              <option value="salary">Salary</option>
                              <option value="duration">Duration</option>
                              <option value="rating">Rating</option>
                            </Form.Control>
                          </Form.Group>
                        </Col>
                        <Col xs={12} sm={6}>
                          <Form.Group controlId="sortType">
                            <Form.Check
                              custom
                              label="Desc"
                              className="mt-xs-0 mt-sm-4"
                              onChange={this.sortJobsType}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Col>
                    <Form>
                      <Row>
                        <Col xs="auto">
                          <Form.Group controlId="showApplied">
                            <Form.Check
                              custom
                              label="Show applied jobs"
                              className="mt-2"
                              defaultChecked={true}
                              onChange={this.filterAppliedJobs}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col xs={12} lg={9}>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Company</th>
                    <th>Skills</th>
                    <th>Rating</th>
                    <th>Salary</th>
                    <th>Deadline</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.filterJobs().map((obj, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{obj.title}</td>
                      <td>{obj.recruiter_details.company}</td>
                      <td>{obj.skills.join(", ")}</td>
                      <td>{RoundNumber(obj.rating, 2)}</td>
                      <td>{obj.salary}</td>
                      <td>{formatDate(new Date(obj.deadline), true)}</td>
                      <td>{obj.job_type}</td>
                      <td>
                        {+obj.duration === 0
                          ? "Indefinite"
                          : +obj.duration === 1
                          ? `${obj.duration} month`
                          : `${obj.duration} months`}
                      </td>
                      <td>
                        <ApplyModalWindow
                          jobData={obj}
                          can_apply={this.state.can_apply}
                          applied={this.state.jobsApplied.includes(obj._id)}
                          onSubmit={this.applyToJob}
                        />
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

ApplicantDashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ApplicantDashboard);
