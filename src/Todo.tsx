import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios, { AxiosError } from "axios";
import "./App.css";

async function fetchTodos(): Promise<Array<TodoItem>> {
  const { data } = await axios.get(
    `${process.env.REACT_APP_BACKEND_SERVER}/todo`
  );
  return data.todos;
}

async function deleteTodo(id: string) {
  await axios.delete(`${process.env.REACT_APP_BACKEND_SERVER}/todo/${id}`);
}

function ErrorMessage({ code }: { code: ErrorCode }) {
  return (
    <span style={{ color: "red" }}>
      {code === 404
        ? "Error: todo list not found"
        : "Unknown error occured, please try later"}
    </span>
  );
}

function TodoList({ items, onDelete }: TodoListProps) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.text}
          <button type="button" onClick={onDelete.bind(null, item.id)}>
            X
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function Todo() {
  const [items, setItems] = useState<Array<TodoItem>>([]);
  const [text, setText] = useState("");
  const [errorCode, setErrorCode] = useState<ErrorCode>(null);

  useEffect(() => {
    const fetchAndSetTodos = async () => {
      try {
        const todos = await fetchTodos();
        setItems(todos);
      } catch (error) {
        const response = (error as AxiosError).response;
        setErrorCode(response ? response.status : 500);
      }
    };
    fetchAndSetTodos();
  }, []);

  async function handleDeleteTodo(id: string) {
    await deleteTodo(id);
    setItems(await fetchTodos());
  }

  function handleChange(e: any) {
    setText(e.target.value);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (text.length === 0) {
      return;
    }
    const newItem: TodoItem = {
      text: text,
      id: uuidv4(),
    };

    await axios.post(`${process.env.REACT_APP_BACKEND_SERVER}/todo`, newItem);
    setItems(await fetchTodos());
    setText("");
  }

  if (errorCode) {
    return <ErrorMessage code={errorCode} />;
  }

  return (
    <div className="container">
      <h3>Todo App using Mock Service Worker</h3>
      <TodoList items={items} onDelete={handleDeleteTodo} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="new-todo">What needs to be done?</label>
        <input id="new-todo" onChange={handleChange} value={text} />
        <button>Add</button>
      </form>
    </div>
  );
}

interface TodoItem {
  id: string;
  text: string;
}

interface TodoListProps {
  items: Array<TodoItem>;
  onDelete: (id: string) => void;
}

type ErrorCode = number | null;
