import { v4 } from "uuid";
import axios from "axios";
import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

jest.mock("axios");

describe("request mocking using nock", () => {
  beforeEach(() => {
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockImplementation(() =>
      Promise.resolve({
        data: { todos: defaultTodos() },
      })
    );
  });

  afterEach(jest.restoreAllMocks);

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
