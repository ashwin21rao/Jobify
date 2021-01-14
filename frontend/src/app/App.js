import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import CustomMuiTheme from "../components/Muitheme";

import LoginContainer from "../pages/login/LoginContainer";
import LoginForm from "../pages/login/LoginForm";
import SignupForm from "../pages/login/SignupForm";

import ApplicantDashboard from "../pages/applicant/Dashboard";
import MyApplications from "../pages/applicant/Applications";
import ApplicantProfile from "../pages/applicant/Profile";

import RecruiterDashboard from "../pages/recruiter/Dashboard";
import AcceptedEmployees from "../pages/recruiter/Acceptances";
import RecruiterProfile from "../pages/recruiter/Profile";
import AddListing from "../pages/recruiter/AddListing";
import JobSpecificApplications from "../pages/recruiter/JobSpecificApplications";

function App() {
  return (
    <ThemeProvider theme={CustomMuiTheme}>
      <CssBaseline />
      <Router>
        {/* <Switch>
          <Route path="/" exact>
            <LoginContainer>
              <LoginForm />
            </LoginContainer>
          </Route>
          <Route path="/signup" exact>
            <LoginContainer>
              <SignupForm />
            </LoginContainer>
          </Route>
          <Route path="/dashboard" exact component={ApplicantDashboard} />
          <Route path="/applications" exact component={MyApplications} />
          <Route path="/profile" exact component={ApplicantProfile} />
        </Switch> */}

        <Switch>
          <Route path="/" exact>
            <LoginContainer>
              <LoginForm />
            </LoginContainer>
          </Route>
          <Route path="/signup" exact>
            <LoginContainer>
              <SignupForm />
            </LoginContainer>
          </Route>
          <Route path="/dashboard" exact component={RecruiterDashboard} />
          <Route path="/acceptances" exact component={AcceptedEmployees} />
          <Route path="/profile" exact component={RecruiterProfile} />
          <Route
            path="/addlisting"
            exact
            component={(props) => <AddListing {...props} />}
          />
          <Route
            path="/applications"
            exact
            component={(props) => <JobSpecificApplications {...props} />}
          />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
