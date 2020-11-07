import "./App.css";
import { useMemo, useState, useCallback, setErrors } from "react";
import React from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import axios from "axios";
import Sidebar from "./Components/Sidebar";
import SignInPage from "./Components/SignInPage";
import Logo from "./Assets/png_style.svg";
import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectinData } from "react-firebase-hooks/firestore";
import sickoMode from "./Components/sickoMode";

const syllable = require("syllable");

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
const firestore = firebase.firestore();

let SyllableIndicator = (children) => {
  let line = children.props.node.children[0].text;
  let numSyllables = syllable(line);
  let outcome = line === "break";
  return (
    <span
      className={outcome ? "emptyLine" : "syllables"}
      data-slate-editor
      contentEditable={false}
    >
      {outcome ? "" : numSyllables}
    </span>
  );
};

const items = [
  // { name: "account", label: "Account" },
  {
    name: "songs",
    label: "Songs",
    items: [
      { name: "sickoMode", label: "SICKO MODE" },
      { name: "goosebumps", label: "goosebumps" },
      { name: "create", label: "+ New" },
    ],
  },
  { name: "logout", label: "Log Out" },
];

function App() {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [user] = useAuthState(auth);
  // const [value, setValue] = useState([
  //   {
  //     type: "paragraph",
  //     children: [{ text: "Start writing here." }],
  //   },
  // ]);
  const [value, setValue] = useState(sickoMode);

  const [rhymeWords, setrhymeWords] = useState("");
  let searchRhymes = async (word) => {
    axios
      .all([
        axios.get(`https://api.datamuse.com/words?rel_rhy=${word}`),
        axios.get(`https://api.datamuse.com/words?rel_nry=${word}`),
      ])
      .then(
        axios.spread((res1, res2) => {
          // let data = res1.data.concat(res2.data);
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

  if (user) {
    return (
      <div className="App">
        <Sidebar items={items}></Sidebar>
        <div className="container">
          <div className="textEditor">
            <Slate
              editor={editor}
              value={value}
              onChange={(newValue) => {
                if (editor.getFragment()[0] !== undefined) {
                  let highlighted = editor.getFragment()[0].children[0].text;
                  if (highlighted.length > 0) searchRhymes(highlighted);
                  // console.log(JSON.stringify(newValue));
                  setValue(newValue);
                  let i;
                  for (i = 0; i < newValue.length; i++) {
                    let line = newValue[i].children[0].text;
                    console.log(syllable(line), line);
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
