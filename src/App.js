import "./App.css";
import { useMemo, useState, useCallback, setErrors } from "react";
import React from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import axios from "axios";
import Sidebar from "./Components/Sidebar";
import SignInPage from "./Components/SignInPage";
import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

import startingVal from "./Components/Songs/startingVal";

const syllable = require("syllable");

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
const db = firebase.firestore();

let SyllableIndicator = (children) => {
  let line = children.props.node.children[0].text;
  let numSyllables = syllable(line);
  let outcome = line === "break";
  return (
    <span
      className={
        outcome ? "emptyLine" : line.startsWith("#") ? "titleLeft" : "syllables"
      }
      data-slate-editor
      contentEditable={false}
    >
      {outcome ? "" : numSyllables}
    </span>
  );
};

// TODO: Similar to how the tutorial uses .add, use .add for every new song and reference it with a key, update sidebar. It's okay if the sidebar shows the keys for now.

function App() {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [user] = useAuthState(auth);
  const [value, setValue] = useState(startingVal);
  const [rhymeWords, setrhymeWords] = useState("");
  // const [sideBarItems, setSideBarItems] = useState([
  //   { name: "new", title: "New" },
  //   { name: "logout", title: "Log Out" },
  // ]);

  const searchRhymes = async (word) => {
    axios
      .all([
        axios.get(`https://api.datamuse.com/words?rel_rhy=${word}`),
        axios.get(`https://api.datamuse.com/words?rel_nry=${word}`),
      ])
      .then(
        axios.spread((res1, res2) => {
          let elems = [];
          res1.data.forEach((wordSet) => {
            elems.push(<div className="rhymeWord">{wordSet.word}</div>);
          });
          res2.data.forEach((wordSet) => {
            elems.push(<div className="rhymeWordNear">{wordSet.word}</div>);
          });
          setrhymeWords(elems);
        })
      );
  };

  const renderElement = useCallback(({ attributes, children, element }) => {
    return (
      <div className="line" {...attributes}>
        {SyllableIndicator(children)}
        {children}
      </div>
    );
  }, []);

  const userRef = user ? db.collection(user.uid) : db.collection("signedout");
  const [snapshot] = useCollectionData(userRef);
  if (user && !snapshot) {
    userRef.doc("sidebar").set({
      items: [
        { name: "sickoMode", title: "SICKO MODE" },
        { name: "goosebumps", title: "goosebumps" },
        { name: "new", title: "New" },
        { name: "logout", title: "Log Out" },
      ],
    });
  }

  if (user) {
    return (
      <div className="App">
        <Sidebar
          // items={sideBarItems}
          items={snapshot == undefined ? [] : snapshot[0].items}
          modify={(input) => {
            setValue(input);
            setrhymeWords("");
          }}
        ></Sidebar>
        <div className="container">
          <div className="textEditor">
            <Slate
              editor={editor}
              value={value}
              onChange={(newValue) => {
                // console.log(JSON.stringify(newValue));

                if (editor.getFragment()[0] !== undefined) {
                  let highlighted = editor.getFragment()[0].children[0].text;
                  if (highlighted.length > 0) searchRhymes(highlighted);
                  setValue(newValue);
                  let i;
                  for (i = 0; i < newValue.length; i++) {
                    let line = newValue[i].children[0].text;
                  }
                }
              }}
            >
              <Editable renderElement={renderElement} />
            </Slate>
          </div>
        </div>
        <div contentEditable={false} className="rhymeContainer">
          {rhymeWords}
        </div>
      </div>
    );
  } else {
    return <SignInPage></SignInPage>;
  }
}

export default App;
