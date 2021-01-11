import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import LoginContainer from "../pages/login/LoginContainer";

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
      <LoginContainer />
    </ThemeProvider>
  );
}

export default App;
