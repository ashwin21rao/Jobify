import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Jumbotron from "react-bootstrap/Jumbotron";
import { Formik } from "formik";
import * as yup from "yup";

function ApplyModalWindow(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  const schema = yup.object({
    sop: yup
      .string()
      .required("Statement of purpose is required")
      .matches(/^\s*\S+(?:\s+\S+){0,249}\s*$/, "SOP must not exceed 250 words"),
  });

  const handleSubmit = async (values) => {
    if (await schema.validate(values)) {
      props.onSubmit(values.sop.trim(), props.jobData);
      handleClose();
    }
  };

  return (
    <React.Fragment>
      {renderButton()}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Statement of Purpose</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={schema}
            onSubmit={handleSubmit}
            initialValues={{ sop: "" }}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              errors,
            }) => (
              <Form id="modalForm" noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="sop">
                  <Form.Control
                    as="textarea"
                    rows={7}
                    name="sop"
                    required
                    value={values.sop}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors.sop}
                    isValid={touched.sop && !errors.sop}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.sop}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form>
            )}
          </Formik>
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

function RateJobModalWindow(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { applicant_details } = props.jobData;

  const schema = yup.object({
    rating: yup
      .number()
      .required("Rating is required")
      .min(1, "Rating must be between 1 and 5")
      .max(5, "Rating must be between 1 and 5"),
  });

  const handleSubmit = async (values) => {
    if (await schema.validate(values)) {
      props.onSubmit(values.rating, props.jobData);
      handleClose();
    }
  };

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
          <Formik
            validationSchema={schema}
            onSubmit={handleSubmit}
            initialValues={{ rating: applicant_details.job_rating || "" }}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              errors,
            }) => (
              <Form id="modalForm" noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="rating">
                  <Form.Control
                    type="number"
                    required
                    name="rating"
                    value={values.rating}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors.rating}
                    isValid={touched.rating && !errors.rating}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.rating}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form>
            )}
          </Formik>
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

function RateEmployeeModalWindow(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { applicant_details } = props.applicantData;

  const schema = yup.object({
    rating: yup
      .number()
      .required("Rating is required")
      .min(1, "Rating must be between 1 and 5")
      .max(5, "Rating must be between 1 and 5"),
  });

  const handleSubmit = async (values) => {
    if (await schema.validate(values)) {
      props.onSubmit(values.rating, props.applicantData);
      handleClose();
    }
  };

  return (
    <React.Fragment>
      <Button variant="outline-info" onClick={handleShow}>
        Rate
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Rating (1-5)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={schema}
            onSubmit={handleSubmit}
            initialValues={{ rating: applicant_details.applicant_rating || "" }}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              touched,
              errors,
            }) => (
              <Form id="modalForm" noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="rating">
                  <Form.Control
                    type="number"
                    required
                    name="rating"
                    value={values.rating}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={errors.rating}
                    isValid={touched.rating && !errors.rating}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.rating}
                  </Form.Control.Feedback>
                </Form.Group>
              </Form>
            )}
          </Formik>
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

function ShowSOPModalWindow(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <React.Fragment>
      <Button
        variant="link"
        onClick={handleShow}
        style={{ padding: 0, fontSize: "inherit" }}
      >
        Show SOP
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Statement of Purpose</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Jumbotron style={{ padding: "1rem" }}>
            <div>{props.sop}</div>
          </Jumbotron>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}

export {
  ApplyModalWindow,
  RateJobModalWindow,
  RateEmployeeModalWindow,
  ShowSOPModalWindow,
};
