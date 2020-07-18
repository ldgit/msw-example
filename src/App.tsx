import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios, { AxiosError } from "axios";
import logo from "./logo.svg";
import "./App.css";

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <main>
        <TodoApp />
      </main>
    </div>
  );
}

interface TodoItem {
  id: string;
  text: string;
}

interface TodoListProps {
  items: Array<TodoItem> | number;
  onDelete: (id: string) => void;
}

async function fetchTodos(): Promise<Array<TodoItem> | number> {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_BACKEND_SERVER}/todo`
    );
    return data.todos;
  } catch (error) {
    const response = (error as AxiosError).response;
    return response ? response.status : 500;
  }
}

async function deleteTodo(id: string) {
  await axios.delete(`${process.env.REACT_APP_BACKEND_SERVER}/todo/${id}`);
}

function TodoApp() {
  const [items, setItems] = useState<Array<TodoItem> | number>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchAndSetTodos = async () => {
      const todos = await fetchTodos();
      if (isMounted) {
        setItems(todos);
      }
    };

    fetchAndSetTodos();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleDeleteTodo(id: string) {
    await deleteTodo(id);
    setItems(await fetchTodos());
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
}

function TodoList({ items, onDelete }: TodoListProps) {
  if (typeof items === "number") {
    return items === 404 ? (
      <span style={{ color: "red" }}>Error: todo list not found</span>
    ) : (
      <span style={{ color: "red" }}>
        Unknown error occured, please try later
      </span>
    );
  }

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
