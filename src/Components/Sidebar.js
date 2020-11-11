import React from "react";
import { useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import AddIcon from "@material-ui/icons/Add";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonIcon from "@material-ui/icons/Person";

import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import firebaseConfig from "../firebase.config";

import "../App.css";

import sickoMode from "./Songs/sickoMode";
import goosebumps from "./Songs/goosebumps";
import startingVal from "./Songs/startingVal";

import Editable from "react-editable-title";
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import SFCompact from "../Assets/SF_Compact/SFCompactText-Regular.otf";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const firestore = firebase.firestore();

const sfcompact = {
  fontFamily: "SFCompact",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
    url(${SFCompact}) format('otf')
  `,
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF",
};
const theme = createMuiTheme({
  typography: {
    fontFamily: "SFCompact",
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "@font-face": [sfcompact],
      },
    },
  },
});

function SidebarItem({
  name,
  title,
  modify,
  dbRef,
  setSongID,
  setTitle,
  specialVal,
  ...rest
}) {
  const [text, setText] = useState(name);
  const handleTextUpdate = (current) => {
    setText(current);
    dbRef
      .doc("sidebar")
      .get()
      .then((res) => {
        let copy = res.data().items;
        // console.log(copy);
        let i;
        // console.log(copy.items, title);
        for (i = 0; i < copy.length; i += 1) {
          if (copy[i].id == title) {
            copy[i].name = current;
          }
        }
        // console.log(copy);
        dbRef.doc("sidebar").set({ items: copy });
        setTitle(current);
      });
  };

  return (
    <ListItem
      onClick={() => {
        dbRef
          .doc(title)
          .get()
          .then((res) => {
            modify(res.data().data);
          })
          .catch(console.log);
        setSongID(title);
        setTitle(name);
      }}
      button
      dense
      {...rest}
    >
      <ListItemText {...rest}>
        <span className="iconListItem">
          <MusicNoteIcon
            style={{ fontSize: 20, paddingRight: 5 }}
          ></MusicNoteIcon>
          <Editable
            text={text}
            editControls
            placeholder="Type here"
            cb={handleTextUpdate}
          />
          {/* <span>{name}</span> */}
        </span>
      </ListItemText>
    </ListItem>
  );
}

function Sidebar(props) {
  return (
    <div className="sideBarContainer">
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <List disablePadding dense>
          <ListItem button dense onClick={() => props.setSongID("")}>
            <PersonIcon style={{ fontSize: 20, paddingRight: 5 }}></PersonIcon>
            <ListItemText>
              <span>Account</span>
            </ListItemText>
          </ListItem>
          <ListItem
            onClick={() => {
              props.dbRef
                .add({
                  data: startingVal,
                })
                .then(function (docRef) {
                  props.dbRef.doc("sidebar").update({
                    items: firebase.firestore.FieldValue.arrayUnion({
                      name: "Untitled",
                      title: docRef.id,
                      id: docRef.id,
                    }),
                  });
                  props.setSongID(docRef.id);
                  props.setTitle("Untitled");
                  props.modify(startingVal);
                })
                .catch(function (error) {
                  console.error("Error adding document: ", error);
                });
            }}
            button
            dense
          >
            <ListItemText>
              <span className="iconListItem">
                <AddIcon style={{ fontSize: 20, paddingRight: 5 }}></AddIcon>
                <span>New</span>
              </span>
            </ListItemText>
          </ListItem>
          {props.items.map((sidebarItem, index) => (
            <SidebarItem
              name={sidebarItem.name}
              title={sidebarItem.title}
              modify={props.modify}
              dbRef={props.dbRef}
              specialVal={sidebarItem.name}
              setSongID={props.setSongID}
              setTitle={props.setTitle}
              {...sidebarItem}
            />
          ))}
        </List>

        <ListItem button dense onClick={() => auth.signOut()}>
          <ExitToAppIcon
            style={{ fontSize: 20, paddingRight: 5 }}
          ></ExitToAppIcon>
          <ListItemText>
            <span>Logout</span>
          </ListItemText>
        </ListItem>
      </ThemeProvider>
    </div>
  );
}

export default Sidebar;
