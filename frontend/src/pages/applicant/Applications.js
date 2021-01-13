import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import ApplicantNavbar from "./Navbar";
import { Container, Row, Col } from "react-bootstrap/";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import MainHeading from "../../components/MainHeading";
import ModalWindow from "../../components/ModalWindow";

const jobs = [
  {
    title: "Software intern",
    company: "FCA",
    rating: 5,
    salary: 10000,
    type: "full time",
    duration: "23",
    status: "Accepted",
    joinDate: Date.now(),
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
  },
  {
    title: "Software intern",
    company: "FCA",
    rating: 5,
    salary: 10000,
    type: "full time",
    duration: "23",
    status: "Rejected",
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
  },
  {
    title: "Software intern",
    company: "FCA",
    rating: 5,
    salary: 10000,
    type: "full time",
    duration: "23",
    status: "Rejected",
  },
];

class MyApplications extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <ApplicantNavbar />
        <Container fluid="lg">
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
                  {jobs.map((obj, i) => (
                    <tr>
                      <td>{i + 1}</td>
                      <td>{obj.title}</td>
                      <td>{obj.company}</td>
                      <td>{obj.rating}</td>
                      <td>{obj.salary}</td>
                      <td>{obj.type}</td>
                      <td>{obj.duration}</td>
                      <td>{obj.status}</td>
                      <td>{obj.joinDate ?? ""}</td>
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

export default MyApplications;
