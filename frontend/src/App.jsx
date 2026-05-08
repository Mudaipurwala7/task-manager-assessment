import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [editingId, setEditingId] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const API_URL = 'http://127.0.0.1:8000/api/tasks/';

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}?page=${page}&search=${search}`);
      setTasks(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 5));
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, search]);

  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('Pending');
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || title.length < 3) {
      setError('Title must be at least 3 characters long.');
      return;
    }

    const taskData = { title, description, status };

    try {
      if (editingId) {
        await axios.put(`${API_URL}${editingId}/`, taskData);
      } else {
        await axios.post(API_URL, taskData);
      }
      resetForm(); 
      fetchTasks();
    } catch (err) {
      setError('Failed to save task. Check backend validation.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        fetchTasks();
      } catch (err) {
        console.error("Error deleting task", err);
      }
    }
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setEditingId(task.id);
  };

  
  const getStatusColor = (taskStatus) => {
    if (taskStatus === 'Completed') return { background: '#D1FAE5', color: '#065F46' };
    if (taskStatus === 'In Progress') return { background: '#FEF3C7', color: '#92400E' };
    return { background: '#F3F4F6', color: '#374151' }; // Pending
  };

  return (
    <div className="container">
      <h1>Task Manager </h1>

      {/* Form Card */}
      <div className="card">
        <h3>{editingId ? 'Edit Task' : 'Create New Task'}</h3>
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Title</label>
            <input 
              type="text" 
              placeholder="Add Title"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              placeholder="Add more details here..."
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <button type="submit" className="btn-primary">
            {editingId ? 'Update Task' : 'Save Task'}
          </button>
          {editingId && (
            
            <button type="button" className="btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>
      </div>

      
      <div className="card">
        <div className="form-group">
          <input 
            type="text" 
            placeholder="🔍 Search tasks by title or status..." 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Status</th>
                <th>Date Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? tasks.map(task => (
                <tr key={task.id}>
                  <td style={{ fontWeight: 'bold' }}>{task.title}</td>
                  <td>
                    <span className="status-badge" style={getStatusColor(task.status)}>
                      {task.status}
                    </span>
                  </td>
                  <td>{new Date(task.date).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-primary" onClick={() => handleEdit(task)} style={{ marginRight: '10px' }}>Edit</button>
                    <button className="btn-danger" onClick={() => handleDelete(task.id)}>Delete</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No tasks found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        
        <div className="pagination">
          <button className="btn-primary" disabled={page === 1} onClick={() => setPage(page - 1)}>
            &larr; Previous
          </button>
          <span style={{ fontWeight: 'bold' }}>Page {page} of {totalPages || 1}</span>
          <button className="btn-primary" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;