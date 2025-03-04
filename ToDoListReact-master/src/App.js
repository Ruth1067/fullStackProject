import React, { useEffect, useState } from 'react';
import service from './service.js';

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // מצב למודול

  async function getTodos() {
    try {
      const todos = await service.getTasks();
      console.log("Retrieved todos:", todos);
      if (Array.isArray(todos)) {
        setTodos(todos);
      } else {
        console.error("Expected todos to be an array, but got:", todos);
        setTodos([]);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTodos([]);
    }
  }
  

  async function createTodo(e) {
    e.preventDefault();
    await service.addTask(newTodo);
    setNewTodo("");
    setIsModalOpen(false);
    await getTodos();
  }

  async function updateCompleted(todo, isComplete) {
    await service.setCompleted(todo, isComplete);
    await getTodos();
  }

  async function deleteTodo(id) {
    await service.deleteTask(id);
    await getTodos();
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <button onClick={() => setIsModalOpen(true)}>הוסף משימה</button> {/* כפתור הוספה */}
        {isModalOpen && (
          <div className="modal">
            <form onSubmit={createTodo}>
              <input 
                className="new-todo" 
                placeholder="הכנס את שם המשימה" 
                value={newTodo} 
                onChange={(e) => setNewTodo(e.target.value)} 
              />
              <button type="submit">שמור</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>סגור</button>
            </form>
          </div>
        )}
      </header>
      <section className="main" style={{ display: "block" }}>
        <ul className="todo-list">
          {todos?.map(todo => {
            return (
              <li className={todo.isComplete ? "completed" : ""} key={todo.id}>
                <div className="view">
                  <input className="toggle" type="checkbox" defaultChecked={todo.isComplete} onChange={(e) => updateCompleted(todo, e.target.checked)} />
                  <label>{todo.name}</label>
                  <button className="destroy" onClick={() => deleteTodo(todo.id)}></button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </section>
  );
}

export default App;
