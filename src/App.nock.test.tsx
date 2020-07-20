import nock from "nock";
import { v4 } from "uuid";
import axios from "axios";
import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

axios.defaults.adapter = require("axios/lib/adapters/http");

describe("request mocking using nock", () => {
  beforeEach(() => {
    nock(process.env.REACT_APP_BACKEND_SERVER as string)
      .get("/todo")
      .reply(200, { todos: defaultTodos() });
  });

  afterEach(nock.restore);

  it("renders initial todo items", async () => {
    const { findByText } = render(<App />);
    expect(
      await findByText(/Prepare basic todo application/i)
    ).toBeInTheDocument();
    expect(await findByText(/Setup mock server/i)).toBeInTheDocument();
    expect(await findByText("...")).toBeInTheDocument();
    expect(await findByText(/Profit!/i)).toBeInTheDocument();
  });
});

function defaultTodos(): Array<any> {
  return [
    {
      text: "Prepare basic todo application",
      id: v4(),
    },
    {
      text: "Setup mock server",
      id: v4(),
    },
    {
      text: "...",
      id: v4(),
    },
    {
      text: "Profit!",
      id: v4(),
    },
  ];
}
