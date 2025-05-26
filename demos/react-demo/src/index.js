import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Player from "./Player";
// import Player from "./PlayerClass";

ReactDOM.render(
  <React.StrictMode>
    <Player />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
