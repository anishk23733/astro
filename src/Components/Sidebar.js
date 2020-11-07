import React from "react";
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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const firestore = firebase.firestore();

function SidebarItem({ title, modify, specialVal, ...rest }) {
  switch (specialVal) {
    case "logout":
      return (
        <ListItem button dense {...rest} onClick={() => auth.signOut()}>
          <ExitToAppIcon
            style={{ fontSize: 16, paddingRight: 5 }}
          ></ExitToAppIcon>
          <ListItemText>
            <span>{title}</span>
          </ListItemText>
        </ListItem>
      );
    case "new":
      return (
        <ListItem
          onClick={() => {
            modify(startingVal);
          }}
          button
          dense
          {...rest}
        >
          <ListItemText>
            <span className="iconListItem">
              <AddCircleIcon
                style={{ fontSize: 16, paddingRight: 5 }}
              ></AddCircleIcon>
              <span>{title}</span>
            </span>
          </ListItemText>
        </ListItem>
      );
    case "goosebumps":
      return (
        <ListItem
          onClick={() => {
            modify(goosebumps);
          }}
          button
          dense
          {...rest}
        >
          <ListItemText>
            <span className="iconListItem">
              <LibraryMusicIcon
                style={{ fontSize: 16, paddingRight: 5 }}
              ></LibraryMusicIcon>
              <span>{title}</span>
            </span>
          </ListItemText>
        </ListItem>
      );
    case "sickoMode":
      return (
        <ListItem
          onClick={() => {
            modify(sickoMode);
          }}
          button
          dense
          {...rest}
        >
          <ListItemText>
            <span className="iconListItem">
              <LibraryMusicIcon
                style={{ fontSize: 16, paddingRight: 5 }}
              ></LibraryMusicIcon>
              <span>{title}</span>
            </span>
          </ListItemText>
        </ListItem>
      );
    default:
      return (
        <ListItem
          onClick={() => {
            modify(sickoMode);
          }}
          button
          dense
          {...rest}
        >
          <ListItemText>
            <span className="iconListItem">
              <LibraryMusicIcon
                style={{ fontSize: 16, paddingRight: 5 }}
              ></LibraryMusicIcon>
              <span>{title}</span>
            </span>
          </ListItemText>
        </ListItem>
      );
  }
}

function Sidebar({ items, modify }) {
  return (
    <div className="sideBarContainer">
      <List disablePadding dense>
        {items.map((sidebarItem, index) => (
          <SidebarItem
            title={sidebarItem.title}
            modify={modify}
            key={`${sidebarItem.name}${index}`}
            specialVal={sidebarItem.name}
            {...sidebarItem}
          />
        ))}
      </List>
    </div>
  );
}

export default Sidebar;
