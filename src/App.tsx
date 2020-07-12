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

interface TodoListProps {
  items: Array<TodoItem>;
  onDelete: (id: string) => void;
}

async function fetchTodos() {
  const { data } = await axios.get(
    `${process.env.REACT_APP_BACKEND_SERVER}/todo`
  );
  return data.todos;
}

async function deleteTodo(id: string) {
  await axios.delete(`${process.env.REACT_APP_BACKEND_SERVER}/todo/${id}`);
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
