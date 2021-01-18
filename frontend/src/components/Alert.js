import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";

function DismissibleAlert(props) {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert
        variant={props.variant}
        onClose={() => setShow(false)}
        dismissible={props.dismissable}
      >
        {props.children}
      </Alert>
    );
  }
  return <></>;
}

export default DismissibleAlert;
