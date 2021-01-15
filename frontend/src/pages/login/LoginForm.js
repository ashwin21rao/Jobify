import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import UseFormStyles from "./FormStyles";
import CustomMuiTheme from "../../components/Muitheme";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../app/actions/authActions";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {},
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      console.log(nextProps.auth);

      // go to dashboard after login
      this.props.history.push(`/${nextProps.auth.user.userType}/dashboard`);
    }
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

    const userData = {
      email: this.state.email,
      password: this.state.password,
    };

    console.log(userData);
    this.props.loginUser(userData);
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
        <div className={classes.form__container}>
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
              error={Boolean(errors.email) || Boolean(errors.emailnotfound)}
              helperText={errors.email ?? errors.emailnotfound ?? ""}
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
              error={
                Boolean(errors.password) || Boolean(errors.passwordincorrect)
              }
              helperText={errors.password ?? errors.passwordincorrect ?? ""}
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
}

LoginForm.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(
  withRouter(withStyles(UseFormStyles(CustomMuiTheme))(LoginForm))
);
