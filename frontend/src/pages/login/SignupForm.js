import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import UseFormStyles from "./FormStyles";
import CustomMuiTheme from "../../components/Muitheme";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { signupUser } from "../../app/actions/authActions";

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      userType: "applicant",
      errors: {},
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  componentDidMount() {
    // If logged in, go to dashboard directly
    if (this.props.auth.isAuthenticated) {
      this.props.history.push(`/${this.props.auth.user.userType}/dashboard`);
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      userType: this.state.userType,
    };

    console.log(newUser);
    this.props.signupUser(newUser, this.props.history);
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { classes } = this.props;
    const { errors } = this.state;

    return (
      <form noValidate onSubmit={this.handleSubmit}>
        <div className={classes.root}>
          <div className={classes.form__group}>
            <TextField
              variant="outlined"
              label="Full Name"
              name="name"
              size="small"
              type="text"
              required
              fullWidth={true}
              onChange={this.handleInputChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
            ></TextField>
          </div>
          <div className={classes.form__group}>
            <TextField
              variant="outlined"
              label="Email Address"
              name="email"
              size="small"
              type="email"
              required
              fullWidth={true}
              onChange={this.handleInputChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
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
              onChange={this.handleInputChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
            ></TextField>
          </div>
          <div className={classes.form__group}>
            <TextField
              variant="outlined"
              label="Confirm Password"
              name="password2"
              size="small"
              type="password"
              required
              fullWidth={true}
              onChange={this.handleInputChange}
              error={Boolean(errors.password2)}
              helperText={errors.password2}
            ></TextField>
          </div>
          <div className={classes.form__group}>
            <FormControl>
              <RadioGroup
                row
                name="userType"
                defaultValue="applicant"
                onChange={this.handleInputChange}
              >
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
            <p className={classes.form__mode}>
              Have an account?{" "}
              <Link to="/" className={classes.form__link}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </form>
    );
  }
}

// export default withStyles(UseFormStyles(CustomMuiTheme))(SignupForm);

SignupForm.propTypes = {
  signupUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { signupUser })(
  withRouter(withStyles(UseFormStyles(CustomMuiTheme))(SignupForm))
);
