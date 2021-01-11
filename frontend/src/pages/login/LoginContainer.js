import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    width: "90%",
    margin: "0 auto",
  },

  login__container: {
    display: "flex",
    flexDirection: "column",
  },

  login__heading: {
    textAlign: "center",
    marginBottom: "1.5rem",
    fontSize: "4rem",
    color: theme.palette.primary.dark,
  },

  login__card: {
    padding: "2rem",
    paddingBottom: "1rem",
  },
}));

function LoginContainer(props) {
  const classes = useStyles();

  return (
    <Grid
      container
      className={classes.root}
      alignItems="center"
      justify="center"
    >
      <Grid item xs={12} sm={9} md={6} lg={4}>
        <div className={classes.login__container}>
          <h1 className={classes.login__heading}>Jobify.</h1>
          <Paper elevation={2} className={classes.login__card}>
            {props.children}
          </Paper>
        </div>
      </Grid>
    </Grid>
  );
}

export default LoginContainer;
