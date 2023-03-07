import React, { useState } from 'react';
import TodoList from './components/Todo';
import NewTask from './components/NewTask';

function App() {

  const [todos, setTodos] = useState<{ id: string, text: string }[]>([])

  const addTodo = (text: string) => {
    setTodos(preveState => [...preveState, {
      id: Math.random().toString(),
      text
    }]);
  }

  const deleteTodo = (id: string) => {
    setTodos(prevState => {
      return prevState.filter(td => td.id !== id);
    });
  }

  return (
    <div className="App">
      <NewTask onAddTodo={addTodo} />
      <TodoList items={todos} onDeleteTodo={deleteTodo} />
    </div>
  );
}

export default App;
