import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import firebase from "firebase";
import reportWebVitals from "./reportWebVitals";
import { css } from "@emotion/core";
import HashLoader from "react-spinners/HashLoader";
import "./App.css";

const override = css`
  margin: 0 auto;
`;

ReactDOM.render(
  <React.StrictMode>
    <div className="loaderBox">
      <HashLoader css={override} size={150} color={"#ffa68d"} />
    </div>
  </React.StrictMode>,
  document.getElementById("root")
);

firebase.auth().onAuthStateChanged((user) => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
