import React from "react";
import "./App.css";

import StickyNotes from "./components/stickyNotes/stickyNotes";

export default class App extends React.Component {
  render() {
    return (
      <div
        style={{
          minWidth: "10vw",
          minHeight: "100vh",
          backgroundColor: "#F7FFF7",
          padding: 0,
        }}
      >
        <div className="App">
          <StickyNotes
            width={`400`}
            height={`250`}
            top={`40`}
            left={`20`}
            content={""}
          />
        </div>
      </div>
    );
  }
}
