import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import CustomMuiTheme from "../components/Muitheme";

import LoginContainer from "../pages/login/LoginContainer";
import LoginForm from "../pages/login/LoginForm";
import SignupForm from "../pages/login/SignupForm";
import RouterTree from "../components/RouterTree";

import { Provider } from "react-redux";
import store from "./store";

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);

  // Decode token and get user info and exp
  const decoded = jwt_decode(token);

  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds

  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser()); // Logout user
    window.location.href = "./"; // Redirect to login
  }
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={CustomMuiTheme}>
        <CssBaseline />
        <Router>
          <Switch>
            {/* Login and Signup pages */}
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
            <RouterTree />
          </Switch>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
