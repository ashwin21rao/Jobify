import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import useForm from "../../components/useForm";

function SignupForm(props) {
  const {
    handleSubmit,
    handleInput,
    styles: { LoginFormStyles: useStyles },
  } = useForm({
    username: "",
    email: "",
    password: "",
    userType: "",
  });

  const classes = useStyles();

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.root}>
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
              Have an account?{" "}
              <a href="/" className={classes.form__link}>
                Sign In
              </a>
            </h4>
          </div>
        </div>
      </div>
    </form>
  );
}

export default SignupForm;
