import React, {useState, useEffect} from 'react';

const hostname = 'http://localhost:3010';

const ItemsList = () => {
    const [todos, setTodos] = useState();
    const [newTask, setNewTask] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTodos();
    }, []);
    
    const fetchTodos = async () => {
        setLoading(true);
        try {
            const response = await fetch(hostname + '/api/todos');
            const data = await response.json();
            setTodos(data);
        } catch (error) {
            setError('Error loading todos');
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        // TODO: Prevent the form from submitting if the input is empty

        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(hostname + '/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({task: newTask}),
            });
            if (response.ok) {
                setNewTask('');
                fetchTodos();
            } else {
                setError('Error adding todo');
            }
        } catch (error) {
            setError('Error adding todo');
        } finally {
            setLoading(false);
        }
    }

    const deleteTodo = async (id) => {  
        setLoading(true);
        try {
            const response = await fetch(hostname + '/api/todos/' + id, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchTodos();
            } else {
                setError('Error deleting todo');
            }
        }
        catch (error) {
            setError('Error deleting todo');
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div data-testid='loading'>Loading...</div>;
    if (error) return <div data-testid='error'>{error}</div>;


    return (
        <div>
            <h1>To Do Item List</h1>
            <form onSubmit={async (e) => {handleSubmit(e)}}>
                <input 
                    type='text' 
                    value={newTask} 
                    onChange={(e) => setNewTask(e.target.value)} 
                />
                <button 
                    type='submit'
                     data-testid="add-button"
                >
                    Add
                </button>
                {error && <div className='error' data-testid='error'>{error}</div>}
                <ul>
                    {todos?.map((todo) => (
                        <li key={todo.id}>
                            {todo.task}
                            <button
                                onClick={() =>  deleteTodo(todo.id)}
                                data-testid='delete-button'
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </form>
        </div>
    );
}

export default ItemsList;