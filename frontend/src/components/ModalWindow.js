import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ModalWindow(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  React.cloneElement(React.Children.only(props.children), {
    onClick: handleClose,
  });

  return (
    <React.Fragment>
      <Button variant={props.buttonType.variant} onClick={handleShow}>
        {props.buttonType.label}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.children}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" form={props.formId} type="submit">
            {props.buttonType.label}
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export default ModalWindow;
