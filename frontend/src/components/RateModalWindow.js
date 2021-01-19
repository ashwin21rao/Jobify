import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function RateModalWindow(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { rating } = e.target.elements;

    handleClose();
    props.onSubmit(rating.value, props.jobData);
  };

  const { applicant_details } = props.jobData;

  return (
    <React.Fragment>
      <Button
        variant="outline-info"
        disabled={applicant_details.status !== "Accepted"}
        onClick={handleShow}
      >
        Rate
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Rating (1-5)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="modalForm" onSubmit={handleSubmit}>
            <Form.Group controlId="rating">
              <Form.Control
                type="number"
                min="1"
                max="5"
                required
                defaultValue={applicant_details.job_rating || ""}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" form="modalForm" type="submit">
            Rate
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default RateModalWindow;
