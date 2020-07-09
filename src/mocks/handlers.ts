import { rest } from "msw";

const todos: any = [];

export const handlers = [
  rest.get("/todo", (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ todos }))
  ),

  rest.post("/todo", (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ success: true, id: 1 }))
  ),
];
