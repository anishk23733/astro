import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import "../App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectinData } from "react-firebase-hooks/firestore";
import { useMemo, useState, useCallback, setErrors } from "react";
import Logo from "../Assets/png_style.svg";

import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import firebaseConfig from "../firebase.config";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const firestore = firebase.firestore();

function SignInPage({ label, items, depthStep = 10, depth = 0, ...rest }) {
  let [username, updateUsername] = useState("");
  let [password, updatePassword] = useState("");
  let [errorText, updateErrorText] = useState("");

  return (
    <div className="signInPage">
      <div className="signInContainer">
        <img className="signInLogo" src={Logo}></img>
        <h1>
          <span className="buffalord">as</span>
          <span className="buffalord-g">tr</span>
          <span className="buffalord">o</span>
        </h1>
        <div>
          <p>Welcome back!</p>
          <div className="signInForm">
            <input
              placeholder="Email"
              value={username}
              onChange={(event) => {
                updateUsername(event.target.value);
              }}
            ></input>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => {
                updatePassword(event.target.value);
              }}
            ></input>
            <span className="loginButtonContainer">
              <button
                onClick={() => {
                  auth
                    .signInWithEmailAndPassword(username, password)
                    .then((res) => {
                      if (res.user) {
                        console.log();
                      }
                    })
                    .catch((error) => {
                      updateErrorText(error.message);
                    });
                }}
              >
                Login
              </button>
              <button
                onClick={() => {
                  auth
                    .createUserWithEmailAndPassword(username, password)
                    .then((res) => {
                      if (res.user) {
                        console.log();
                      }
                    })
                    .catch((error) => {
                      updateErrorText(error.message);
                    });
                }}
              >
                Register
              </button>
            </span>
            <p>{errorText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
