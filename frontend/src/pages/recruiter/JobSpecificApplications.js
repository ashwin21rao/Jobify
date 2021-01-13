import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import RecruiterNavbar from "./Navbar";
import { Container, Row, Col } from "react-bootstrap/";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import MainHeading from "../../components/MainHeading";

const users = [
  {
    name: "Ashwin Rao",
    email: "ashwin@gmail.com",
    rating: 5,
    skills: ["C", "C++", "Python"],
    education: [
      {
        name: "IIIT",
        startYear: 2019,
        endYear: 2023,
      },
      {
        name: "IIIT",
        startYear: 2019,
        endYear: 2023,
      },
      {
        name: "IIIT",
        startYear: 2019,
        endYear: 2023,
      },
    ],
    jobDetails: [
      {
        title: "Software intern",
        company: "FCA",
        rating: 5,
        salary: 10000,
        type: "full time",
        duration: "23",
        status: "Accepted",
        joinDate: Date.now(),
        sop:
          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto, ipsam reiciendis odio illo a itaque nihil amet corporis magnam voluptate impedit animi ea aliquam eveniet!",
      },
      {
        title: "Software intern",
        company: "FCA",
        rating: 5,
        salary: 10000,
        type: "full time",
        duration: "23",
        status: "Accepted",
        joinDate: Date.now(),
        sop:
          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto, ipsam reiciendis odio illo a itaque nihil amet corporis magnam voluptate impedit animi ea aliquam eveniet!",
      },
    ],
  },
  {
    name: "Ashwin Rao",
    email: "ashwin@gmail.com",
    rating: 5,
    skills: ["C", "C++", "Python"],
    education: [
      {
        name: "IIIT",
        startYear: 2019,
        endYear: 2023,
      },
      {
        name: "IIIT",
        startYear: 2019,
        endYear: 2023,
      },
      {
        name: "IIIT",
        startYear: 2019,
        endYear: 2023,
      },
    ],
    jobDetails: [
      {
        title: "Software intern",
        company: "FCA",
        rating: 5,
        salary: 10000,
        type: "full time",
        duration: "23",
        status: "Accepted",
        joinDate: Date.now(),
        sop:
          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto, ipsam reiciendis odio illo a itaque nihil amet corporis magnam voluptate impedit animi ea aliquam eveniet!",
      },
      {
        title: "Software intern",
        company: "FCA",
        rating: 5,
        salary: 10000,
        type: "full time",
        duration: "23",
        status: "Accepted",
        joinDate: Date.now(),
        sop:
          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto, ipsam reiciendis odio illo a itaque nihil amet corporis magnam voluptate impedit animi ea aliquam eveniet!",
      },
    ],
  },
  {
    name: "Ashwin Rao",
    email: "ashwin@gmail.com",
    rating: 5,
    skills: ["C", "C++", "Python"],
    education: [
      {
        name: "IIIT",
        startYear: 2019,
        endYear: 2023,
      },
      {
        name: "IIIT",
        startYear: 2019,
        endYear: 2023,
      },
      {
        name: "IIIT",
        startYear: 2019,
        endYear: 2023,
      },
    ],
    jobDetails: [
      {
        title: "Software intern",
        company: "FCA",
        rating: 5,
        salary: 10000,
        type: "full time",
        duration: "23",
        status: "Accepted",
        joinDate: Date.now(),
        sop:
          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto, ipsam reiciendis odio illo a itaque nihil amet corporis magnam voluptate impedit animi ea aliquam eveniet!",
      },
      {
        title: "Software intern",
        company: "FCA",
        rating: 5,
        salary: 10000,
        type: "full time",
        duration: "23",
        status: "Accepted",
        joinDate: Date.now(),
        sop:
          "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Architecto, ipsam reiciendis odio illo a itaque nihil amet corporis magnam voluptate impedit animi ea aliquam eveniet!",
      },
    ],
  },
];

class JobSpecificApplications extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { jobData } = this.props.location; // to get job applicants
    console.log(jobData);

    return (
      <React.Fragment>
        <RecruiterNavbar />
        <Container fluid="lg">
          <Row className="mt-3 mb-3">
            <Col>
              <MainHeading heading="Applications" />
            </Col>
          </Row>
          <Row className="mt-3 mb-3">
            <Col>
              <Form>
                <Row className="align-items-center">
                  <Col xs="auto">
                    <Form.Group controlId="sortBy">
                      <Form.Label>Sort by</Form.Label>
                      <Form.Control as="select" custom>
                        <option value="unsorted">Unsorted</option>
                        <option value="name">Name</option>
                        <option value="jobTitle">Job Title</option>
                        <option value="joinDate">Date of Joining</option>
                        <option value="empRating">Rating</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col xs="auto">
                    <Form.Group controlId="sortType">
                      <Form.Check custom label="Desc" className="mt-4" />
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
                  {users.map((user, i) =>
                    user.jobDetails.map((job, j) => (
                      <tr onClick={() => console.log("Hello")}>
                        <td>{i + j + 1}</td>
                        <td>{user.name}</td>
                        <td>{job.title}</td>
                        <td>{job.joinDate}</td>
                        <td>{job.type}</td>
                        <td>{user.rating}</td>
                        <td>
                          <Button
                            variant="outline-success"
                            className="mr-0 mr-md-2 mb-2 mb-md-0"
                          >
                            Accept
                          </Button>
                          <Button variant="outline-danger">Reject</Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default JobSpecificApplications;
