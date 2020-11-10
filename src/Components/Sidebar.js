import React from "react";
import { useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import firebaseConfig from "../firebase.config";
import "../App.css";
import sickoMode from "./Songs/sickoMode";
import goosebumps from "./Songs/goosebumps";
import startingVal from "./Songs/startingVal";
import Editable from "react-editable-title";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const firestore = firebase.firestore();

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
          <LibraryMusicIcon
            style={{ fontSize: 16, paddingRight: 5 }}
          ></LibraryMusicIcon>
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
      <List disablePadding dense>
        <ListItem button dense onClick={() => auth.signOut()}>
          <ExitToAppIcon
            style={{ fontSize: 16, paddingRight: 5 }}
          ></ExitToAppIcon>
          <ListItemText>
            <span>Logout</span>
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
              <AddCircleIcon
                style={{ fontSize: 16, paddingRight: 5 }}
              ></AddCircleIcon>
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
    </div>
  );
}

export default Sidebar;
