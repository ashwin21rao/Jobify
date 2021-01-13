import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import RecruiterNavbar from "./Navbar";
import { Container, Row, Col } from "react-bootstrap/";
import Button from "react-bootstrap/Button";
import MainHeading from "../../components/MainHeading";

const user = {
  name: "Ashwin Rao",
  email: "ashwin@gmail.com",
  phoneNumber: "90023093423",
  bio:
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi, eum. Tempore ipsam, laudantium, voluptatibus perferendis aperiam quidem voluptatum exercitationem, ipsum ea corporis labore dignissimos itaque veniam excepturi deserunt sequi. Ut modi id rerum enim voluptas obcaecati alias et optio repudiandae itaque, quis amet laudantium aperiam vero illo ab quia impedit nemo non beatae adipisci aliquid qui laboriosam. Similique amet minus sed qui quas rem, animi, explicabo sunt ipsa corrupti dignissimos laborum ut accusamus atque laboriosam beatae fugit quo nostrum error eum voluptas asperiores laudantium. Sequi consequuntur, nisi dolorum aliquam dolor voluptates reiciendis ipsam culpa aperiam minima, qui optio praesentium nostrum.",
};

class RecruiterProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
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
              <Form>
                <Row>
                  <Col xs={12} md={4}>
                    <Form.Group controlId="detailsName">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control defaultValue={user.name} readOnly />
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={4}>
                    <Form.Group controlId="detailsEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        defaultValue={user.email}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={4}>
                    <Form.Group controlId="detailsPhoneNumber">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control defaultValue={user.phoneNumber} readOnly />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={12}>
                    <Form.Group controlId="userBio">
                      <Form.Label>Bio</Form.Label>
                      <Form.Control as="textarea" rows={6} value={user.bio} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col sm={12} sm="auto">
                    <Button variant="success" type="submit">
                      Update details
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default RecruiterProfile;
