import React, { useEffect, useState } from 'react';
const { ipcRenderer } = window.electron;

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    ipcRenderer.invoke('fetch-users').then((data) => {
      console.log('Fetched users:', data);
      setUsers(data);
    }).catch((err) => {
      console.error('Failed to fetch users', err);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    ipcRenderer.invoke('add-user', name).then(() => {
      ipcRenderer.invoke('fetch-users').then((data) => {
        setUsers(data);
        setName(''); // Clear the input field
      });
    }).catch((err) => {
      console.error('Failed to add user', err);
    });
  };

  return (
    <div>
      <h1>Users</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          required
        />
        <button type="submit">Add User</button>
      </form>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
