import React, { useReducer, useState } from 'react';

// Reducer function
const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, { id: Date.now(), text: action.payload, completed: false }];
    case 'TOGGLE_TODO':
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    case 'DELETE_TODO':
      return state.filter(todo => todo.id !== action.payload);
    default:
      return state;
  }
};

const ToDo = () => {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [input, setInput] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch({ type: 'ADD_TODO', payload: input.trim() });
      setInput('');
    }
  };


  return (
    <div className='max-w-md mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4'>Todo List</h1>
      
      <form onSubmit={handleSubmit} className='mb-4'>
        <div className='flex gap-2'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Add new todo'
            className='flex-1 p-2 border rounded'
          />
          <button 
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          >
            Add
          </button>
        </div>
      </form>

      <ul className='space-y-2'>
        {todos.map(todo => (
          <li 
            key={todo.id}
            className='flex items-center justify-between p-2 border rounded'
          >
            <div className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={todo.completed}
                onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                className='h-4 w-4'
              />
              <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}
              className='text-red-500 hover:text-red-700'
            >
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDo;
