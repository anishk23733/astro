import React from "react";
import "../App.css";
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
const db = firebase.firestore();

function SignInPage({ label, items, depthStep = 10, depth = 0, ...rest }) {
  let [username, updateUsername] = useState("");
  let [password, updatePassword] = useState("");
  let [errorText, updateErrorText] = useState("");
  let onKeyUp = (evt) => {
    if (evt.key === "Enter") {
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
    }
  };
  return (
    <div className="signInPage">
      <div className="signInContainer not-selectable">
        <img className="signInLogo" src={Logo}></img>
        <h1>
          <span className="buffalord">as</span>
          <span className="buffalord-g">tr</span>
          <span className="buffalord">o</span>
        </h1>
        <div>
          <div className="signInForm">
            <input
              onKeyPress={onKeyUp}
              placeholder="Email"
              value={username}
              onChange={(event) => {
                updateUsername(event.target.value);
              }}
            ></input>
            <input
              onKeyPress={onKeyUp}
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
                        db.collection(res.user.uid).doc("sidebar").set({
                          items: [],
                        });
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
