import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import LoginContainer from "../pages/login/LoginContainer";
import LoginForm from "../pages/login/LoginForm";
import SignupForm from "../pages/login/SignupForm";

const theme = createMuiTheme({
  palette: {
    background: {
      default: "#f4f5fd",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
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
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
