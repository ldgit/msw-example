import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Todo from "./Todo";

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <main>
        <Todo />
      </main>
    </div>
  );
}
