import { rest } from "msw";
import { v4 } from "uuid";

const todos: any = [
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

export const handlers = [
  rest.get(`${process.env.REACT_APP_BACKEND_SERVER}/todo`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ todos }));
  }),

  rest.post(`${process.env.REACT_APP_BACKEND_SERVER}/todo`, (req, res, ctx) => {
    todos.push(req.body);
    return res(ctx.status(200), ctx.json({ success: true, id: 1 }));
  }),
];
