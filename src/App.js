import "./App.css";
import { useMemo, useState, useCallback } from "react";
import React from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import axios from "axios";
import Sidebar from "./Components/Sidebar";
import Logo from "./Assets/png_style.svg";
import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectinData } from "react-firebase-hooks/firestore";

const uuid = require("uuid");
const syllable = require("syllable");

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

let returnSyllableComponent = (children) => {
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
  { name: "account", label: "Account" },
  {
    name: "songs",
    label: "Songs",
    items: [
      { name: "sickoMode", label: "SICKO MODE" },
      { name: "goosebumps", label: "goosebumps" },
      { name: "create", label: "+ New" },
    ],
  },
];

function App() {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "Start writing here." }],
    },
  ]);
  // const [user] = useAuthState(auth);
  let [user, setUser] = useState(false);

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
        {returnSyllableComponent(children)}
        {children}
      </div>
    );
  }, []);

  let signInPage = new SignIn();
  let [page, updatePage] = useState(
    <div className="signInPage">
      <div className="signInContainer" contentEditable="false">
        <img className="signInLogo" src={Logo}></img>
        <h1>Astro</h1>
        <SignIn ref={signInPage}></SignIn>
      </div>
    </div>
  );

  if (signInPage.signIn) {
    return page;
  }

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
                if (highlighted.length > 0)
                  console.log(searchRhymes(highlighted));
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
        <div contentEditable={false} className="rhymeContainer">
          {rhymeWords}
        </div>
      </div>
    </div>
  );
}

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signIn: false,
      register: false,
    };

    this.SignIn = () => {
      this.setState({ signIn: true });
    };
    this.RegisterPage = () => {
      this.setState({ register: true });
    };
  }
  render() {
    return (
      <div>
        <p>Welcome back!</p>
        <div className="signInForm">
          <input placeholder="Username"></input>
          <input placeholder="Password"></input>
          <button
            onClick={() => {
              this.SignIn();
            }}
          >
            Login
          </button>
          <p>
            Not a returning user? <a href="">Register</a>.
          </p>
        </div>
      </div>
    );
  }
}

function Register() {
  return (
    <div className="signInPage">
      <div className="signInContainer" contentEditable="false">
        <img className="signInLogo" src={Logo}></img>
        <h1>Astro</h1>
        <p>Welcome back!</p>
        <div className="signInForm">
          <input placeholder="Username"></input>
          <input placeholder="Password"></input>
          <button>Login</button>
          <p>
            Not a returning user? <a href="">Register</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
export default App;
