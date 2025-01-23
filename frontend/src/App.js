
import './App.css';
import React from 'react';
import ItemsList from './components/ItemsList';
import Todo from './components/ToDo';

function App() {
  return (
    <div className='App'>
      <h1>Matt:</h1>
      <ItemsList />
      <hr 
        style={{
          margin: '2rem 0',
          border: 'none',
          borderBottom: '1px solid #ddd'
        }}  
      />
      <Todo />
    </div>
  );
}

export default App;
