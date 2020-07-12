import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

describe("mock service worker example", () => {
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
