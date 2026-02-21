import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
    <App />
    </ThemeProvider>
  </ApolloProvider>
);
