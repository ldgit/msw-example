import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
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

  it("should delete todo when user clicks on X button", async () => {
    const { findByText, findAllByText, queryByText, getAllByTestId } = render(<App />);

    // Deletes "Prepare basic todo application" todo item
    fireEvent.click((await findAllByText(/X/))[0]);

    await waitFor(() => {
      expect(getAllByTestId("todoItem")).toHaveLength(3);
    });
    expect(queryByText(/Prepare basic todo application/i)).not.toBeInTheDocument();
    expect(await findByText(/Setup mock server/i)).toBeInTheDocument();
    expect(await findByText("...")).toBeInTheDocument();
    expect(await findByText(/Profit!/i)).toBeInTheDocument();
  });
});
