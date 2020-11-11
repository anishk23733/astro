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
import DeleteIcon from "@material-ui/icons/Delete";
import { default as EditableTitle } from "react-editable-title";

import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";

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

function App() {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [user] = useAuthState(auth);
  const [value, setValue] = useState(startingVal);
  const [currSongID, setCurrSongID] = useState("");
  const [rhymeWords, setrhymeWords] = useState("");
  const [title, setTitle] = useState("Untitled");
  // const [source, setSourceLink] = useState("");

  let reset = () => {
    db.collection(user.uid)
      .doc("sidebar")
      .set({
        items: [
          { name: "Log Out", title: "" },
          { name: "New", title: "" },
        ],
      });
  };
  // reset();
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
  const sidebarRef = userRef.doc("sidebar");
  const [snapshot] = useCollectionData(userRef);
  const [sidebarVals] = useDocumentData(sidebarRef);

  const deleteCurrentSong = () => {
    sidebarRef.get().then((res) => {
      let copy = res.data().items;
      // console.log(copy);
      let i;
      // console.log(copy.items, title);
      for (i = 0; i < copy.length; i += 1) {
        if (copy[i].id == currSongID) {
          copy.pop(i);
        }
      }
      sidebarRef.set({ items: copy });
      userRef.doc(currSongID).delete();
      setCurrSongID("");
      setrhymeWords("");
    });
  };

  if (user) {
    return (
      <div className="App">
        <Sidebar
          items={sidebarVals == undefined ? [] : sidebarVals.items}
          modify={(input) => {
            setValue(input);
            setrhymeWords("");
          }}
          dbRef={userRef}
          setSongID={setCurrSongID}
          setTitle={setTitle}
        ></Sidebar>
        {currSongID ? (
          <div className="rightContainerTitle">
            <span className="top">
              <DeleteIcon
                style={{ fontSize: 30 }}
                className="deleteIcon"
                onClick={deleteCurrentSong}
              ></DeleteIcon>
              <h1 className="songTitle">{title}</h1>
            </span>
            <div className="container">
              <div className="textEditor">
                <Slate
                  editor={editor}
                  value={value}
                  onChange={(newValue) => {
                    db.collection(user.uid)
                      .doc(currSongID)
                      .update({ data: newValue });

                    if (editor.getFragment()[0] !== undefined) {
                      let highlighted = editor.getFragment()[0].children[0]
                        .text;
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
          </div>
        ) : (
          <div className="homepage not-selectable">
            <h1>Astro</h1>
            <p>Click on "+ New" in the sidebar to start a new song.</p>
            <p>
              Double click on the name in the sidebar to edit the name of the
              song.
            </p>
          </div>
        )}
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
