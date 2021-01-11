import React, { useReducer } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2rem",
    paddingBottom: "1rem",
  },

  form__container: {
    display: "flex",
    flexDirection: "column",
  },

  form__group: {
    "&:not(:last-child)": {
      marginBottom: "2rem",
    },
  },

  form__submit: {
    padding: "0.5rem",
  },

  form__mode: {
    textAlign: "center",
    fontSize: "1.1rem",
  },

  form__link: {
    marginLeft: "0.3rem",
    color: theme.palette.primary.dark,
  },
}));

function LoginForm(props) {
  const classes = useStyles();

  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      username: "",
      email: "",
      password: "",
      userType: "",
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formInput);
  };

  const handleInput = (e) => {
    const name = e.target.name;
    const newValue = e.target.value;
    setFormInput({ [name]: newValue });
  };

  return (
    <Paper elevation={2} className={classes.root}>
      <form onSubmit={handleSubmit}>
        <div className={classes.form__container}>
          <div className={classes.form__group}>
            <TextField
              variant="outlined"
              label="Full Name"
              name="name"
              size="small"
              required
              fullWidth={true}
              onChange={handleInput}
            ></TextField>
          </div>
          <div className={classes.form__group}>
            <TextField
              variant="outlined"
              label="Username"
              name="username"
              size="small"
              required
              fullWidth={true}
              onChange={handleInput}
            ></TextField>
          </div>
          <div className={classes.form__group}>
            <TextField
              variant="outlined"
              label="Email Address"
              name="email"
              size="small"
              required
              fullWidth={true}
              onChange={handleInput}
            ></TextField>
          </div>
          <div className={classes.form__group}>
            <TextField
              variant="outlined"
              label="Password"
              name="password"
              size="small"
              type="password"
              required
              fullWidth={true}
              onChange={handleInput}
            ></TextField>
          </div>
          <div className={classes.form__group}>
            <FormControl>
              <RadioGroup row name="userType" onChange={handleInput}>
                <FormControlLabel
                  control={<Radio color="primary" required />}
                  value="applicant"
                  label="Applicant"
                />
                <FormControlLabel
                  control={<Radio color="primary" required />}
                  value="recruiter"
                  label="Recruiter"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className={classes.form__group}>
            <Button
              variant="contained"
              color="primary"
              className={classes.form__submit}
              fullWidth={true}
              type="Submit"
            >
              Sign Up
            </Button>
          </div>
          <div className={classes.form__group}>
            <div className={classes.form__mode}>
              <h4>
                Have an account?
                <Router>
                  <Link to="/signin" className={classes.form__link}>
                    Sign in
                  </Link>
                  <Route path="/signin" exact />
                </Router>
              </h4>
            </div>
          </div>
        </div>
      </form>
    </Paper>
  );
}

export default LoginForm;
