import React from "react";
import PrivateRoute from "./PrivateRoute";

import ApplicantDashboard from "../pages/applicant/Dashboard";
import MyApplications from "../pages/applicant/Applications";
import ApplicantProfile from "../pages/applicant/Profile";

import RecruiterDashboard from "../pages/recruiter/Dashboard";
import AcceptedEmployees from "../pages/recruiter/Acceptances";
import RecruiterProfile from "../pages/recruiter/Profile";
import AddListing from "../pages/recruiter/AddListing";
import JobSpecificApplications from "../pages/recruiter/JobSpecificApplications";

function RouterTree() {
  return (
    <React.Fragment>
      <PrivateRoute
        path="/applicant/dashboard"
        exact
        component={ApplicantDashboard}
      />
      <PrivateRoute
        path="/applicant/applications"
        exact
        component={MyApplications}
      />
      <PrivateRoute
        path="/applicant/profile"
        exact
        component={ApplicantProfile}
      />{" "}
      <PrivateRoute
        path="/recruiter/dashboard"
        exact
        component={RecruiterDashboard}
      />
      <PrivateRoute
        path="/recruiter/acceptances"
        exact
        component={AcceptedEmployees}
      />
      <PrivateRoute
        path="/recruiter/profile"
        exact
        component={RecruiterProfile}
      />
      <PrivateRoute
        path="/recruiter/addlisting"
        exact
        component={(props) => <AddListing {...props} />}
      />
      <PrivateRoute
        path="/recruiter/applications"
        exact
        component={(props) => <JobSpecificApplications {...props} />}
      />
    </React.Fragment>
  );
}

export default RouterTree;
