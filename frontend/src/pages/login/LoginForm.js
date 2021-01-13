import React from "react";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import useForm from "./useForm";

function LoginForm(props) {
  const {
    handleSubmit,
    handleInput,
    styles: { LoginFormStyles: useStyles },
  } = useForm({
    username: "",
    password: "",
  });

  const classes = useStyles();

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.form__container}>
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
          <Button
            variant="contained"
            color="primary"
            className={classes.form__submit}
            fullWidth={true}
            type="Submit"
          >
            Sign In
          </Button>
        </div>
        <div className={classes.form__group}>
          <div className={classes.form__group}>
            <p className={classes.form__mode}>
              Don't have an account?{" "}
              <Link to="/signup" className={classes.form__link}>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
