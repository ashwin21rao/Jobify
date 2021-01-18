import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

function ApplyModalWindow(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const countWords = (sop) => sop.trim().replace(/\s+/g, " ").split(" ").length;

  const handleSubmit = (e) => {
    e.preventDefault();
    const { sop } = e.target.elements;

    if (countWords(sop.value) <= 250) {
      handleClose();
      props.onSubmit(sop.value, props.jobData);
    }
  };

  function renderButton() {
    const { jobData } = props;

    if (props.applied) {
      return (
        <Button variant="outline-secondary" disabled>
          Applied
        </Button>
      );
    }

    if (
      jobData.positions_available === 0 ||
      jobData.job_applicants.reduce(
        (acc, appl) =>
          appl.status !== "Accepted" && appl.status !== "Rejected"
            ? acc + 1
            : acc,
        0
      ) >= jobData.max_applicants
    ) {
      return (
        <Button variant="outline-danger" disabled>
          Full
        </Button>
      );
    }

    if (!props.applied) {
      return (
        <Button
          variant="outline-success"
          onClick={handleShow}
          disabled={!props.can_apply}
        >
          Apply
        </Button>
      );
    }
  }

  return (
    <React.Fragment>
      {renderButton()}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Statement of Purpose</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="modalForm" onSubmit={handleSubmit}>
            <Form.Group controlId="sop">
              <Form.Control as="textarea" rows={7} name="sop" required />
              <Form.Text className="text-muted">
                SOP must not exceed 250 words.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" form="modalForm" type="submit">
            Apply
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default ApplyModalWindow;
