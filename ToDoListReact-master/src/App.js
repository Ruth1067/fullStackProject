import React, { useEffect, useState } from 'react';
import service from './service.js';

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // מצב למודול

  async function getTodos() {
    const todos = await service.getTasks();
    setTodos(todos);
  }

  async function createTodo(e) {
    e.preventDefault();
    await service.addTask(newTodo);
    setNewTodo(""); // לנקות את השדה
    setIsModalOpen(false); // לסגור את המודול
    await getTodos(); // לרענן את רשימת המשימות
  }

  async function updateCompleted(todo, isComplete) {
    await service.setCompleted(todo, isComplete);
    await getTodos(); // לרענן את רשימת המשימות
  }

  async function deleteTodo(id) {
    await service.deleteTask(id);
    await getTodos(); // לרענן את רשימת המשימות
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
          {todos.map(todo => {
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
