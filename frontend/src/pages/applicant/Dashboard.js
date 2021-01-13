import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import ApplicantNavbar from "./Navbar";
import Form from "react-bootstrap/Form";
import { Container, Row, Col } from "react-bootstrap/";
import Button from "react-bootstrap/Button";
import MainHeading from "../../components/MainHeading";
import ModalWindow from "../../components/ModalWindow";

const jobs = [
  {
    title: "Software intern",
    company: "FCA",
    rating: 5,
    salary: 10000,
    deadline: Date.now(),
    type: "full time",
    duration: "23",
  },
  {
    title: "Software intern",
    company: "FCA",
    rating: 5,
    salary: 10000,
    deadline: Date.now(),
    type: "full time",
    duration: "23",
  },
  {
    title: "Software intern",
    company: "FCA",
    rating: 5,
    salary: 10000,
    deadline: Date.now(),
    type: "full time",
    duration: "23",
  },
  {
    title: "Software intern",
    company: "FCA",
    rating: 5,
    salary: 10000,
    deadline: Date.now(),
    type: "full time",
    duration: "23",
  },
  {
    title: "Software intern",
    company: "FCA",
    rating: 5,
    salary: 10000,
    deadline: Date.now(),
    type: "full time",
    duration: "23",
  },
];

class ApplicantDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <ApplicantNavbar />
        <Container fluid>
          <Row className="mt-3 mb-3">
            <Col>
              <MainHeading heading="Job Listings" />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={12} lg={3}>
              <Container>
                <Row className="mb-1">
                  <Col xs={12}>
                    <Form className="border-bottom">
                      <Form.Group controlId="searchtext">
                        <Form.Label>Search</Form.Label>
                        <Form.Control />
                      </Form.Group>
                    </Form>
                  </Col>
                </Row>
                <Row className="mb-1">
                  <Col>
                    <Form className="border-bottom">
                      <Form.Group controlId="jobtype">
                        <Form.Label>Job type</Form.Label>
                        <Form.Control as="select" custom>
                          <option value="full time">Full time</option>
                          <option value="part time">Part time</option>
                          <option value="work from home">Work from home</option>
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
                            <Form.Control />
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group controlId="maxsalary">
                            <Form.Label>Max salary</Form.Label>
                            <Form.Control />
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
                        <Form.Control as="select" custom>
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
                    <Form>
                      <Row className="align-items-center">
                        <Col xs={12} sm={6}>
                          <Form.Group controlId="sortBy">
                            <Form.Label>Sort by</Form.Label>
                            <Form.Control as="select" custom>
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
              <Table striped bordered hover responsive="lg">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Company</th>
                    <th>Rating</th>
                    <th>Salary</th>
                    <th>Deadline</th>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((obj, i) => (
                    <tr>
                      <td>{i + 1}</td>
                      <td>{obj.title}</td>
                      <td>{obj.company}</td>
                      <td>{obj.rating}</td>
                      <td>{obj.salary}</td>
                      <td>{obj.deadline}</td>
                      <td>{obj.type}</td>
                      <td>{obj.duration}</td>
                      <td>
                        <ModalWindow
                          formId="modalForm"
                          title="Statement of Purpose"
                          buttonType={{
                            label: "Apply",
                            variant: "outline-success",
                          }}
                        >
                          <Form id="modalForm">
                            <Form.Group controlId="sop">
                              <Form.Control as="textarea" rows={7} required />
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

export default ApplicantDashboard;
