import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
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

async function fetchTodos() {
  const { data } = await axios.get(
    `${process.env.REACT_APP_BACKEND_SERVER}/todo`
  );
  return data.todos;
}

function TodoApp() {
  const [items, setItems] = useState<Array<TodoItem>>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchAndSetTodos = async () => {
      setItems(await fetchTodos());
    };

    fetchAndSetTodos();
  }, []);

  return (
    <div className="container">
      <h3>Todo App using Mock Service Worker</h3>
      <TodoList items={items} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="new-todo">What needs to be done?</label>
        <input id="new-todo" onChange={handleChange} value={text} />
        <button>Add #{items.length + 1}</button>
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

function TodoList({ items }: { items: Array<TodoItem> }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}
