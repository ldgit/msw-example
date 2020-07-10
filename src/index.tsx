import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

let serverReady = Promise.resolve();
if (process.env.NODE_ENV === "development") {
  const { worker } = require("./mocks/browser");
  serverReady = worker.start();
}

// Because https://mswjs.io/docs/api/setup-worker/start#waituntilready does not work on Firefox and Safari :(
serverReady.then(() => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById("root")
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
