import React, { Component } from "react";
import { Link } from "react-router-dom";
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
import axios from "axios";

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      userType: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5000/signup", this.state)
      .then((res) => console.log(res));
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  componentDidMount() {
    // axios.get("http://localhost:5000/signup").then(function (response) {
    //   console.log(response.data);
    // });
  }

  render() {
    const { classes } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <div className={classes.root}>
          <div className={classes.form__group}>
            <TextField
              variant="outlined"
              label="Full Name"
              name="name"
              size="small"
              required
              fullWidth={true}
              onChange={this.handleInputChange}
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
            <FormControl>
              <RadioGroup row name="userType" onChange={this.handleInputChange}>
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

export default withStyles(UseFormStyles(CustomMuiTheme))(SignupForm);
