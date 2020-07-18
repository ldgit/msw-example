import React from "react";
import { render, waitFor } from "@testing-library/react";
import App from "./App";
import { server, rest } from "./mocks/testServer";

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

  it.each([
    [404, /Error: todo list not found/i],
    [500, /Unknown error occured, please try later/i],
  ])(
    "should display error message if fetching todo fails (%s => %s)",
    async (statusCode, errorMessage) => {
      server.use(
        rest.get(
          `${process.env.REACT_APP_BACKEND_SERVER}/todo`,
          (req, res, ctx) => {
            return res(ctx.status(statusCode), ctx.json({}));
          }
        )
      );

      const { queryByText } = render(<App />);

      await waitFor(() => {
        expect(queryByText(errorMessage)).toBeInTheDocument();
      });
    }
  );
});
