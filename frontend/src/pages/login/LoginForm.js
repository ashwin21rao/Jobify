import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import UseFormStyles from "./FormStyles";
import CustomMuiTheme from "../../components/Muitheme";
import axios from "axios";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  componentDidMount() {
    axios.get("http://localhost:5000/login").then(function (response) {
      console.log(response.data);
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
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

export default withStyles(UseFormStyles(CustomMuiTheme))(LoginForm);
