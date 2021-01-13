import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.primary.dark,
  },
}));

function MainHeading(props) {
  const classes = useStyles();

  return <h1 className={classes.root}>{props.heading}</h1>;
}

export default MainHeading;
