'use client';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';

export default function Admin() {
  const { token } = useContext(AuthContext);
  const [dietists, setDietists] = useState([]);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const fetchDietists = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/dietists', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load');
      setDietists(await res.json());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { fetchDietists(); }, [token]);

  const createDietist = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/v1/dietists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, name, password }),
      });
      if (!res.ok) throw new Error('Creation failed');
      setUsername('');
      setPassword('');
      setName('');
      await fetchDietists();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteDietist = async (id) => {
    await fetch(`http://localhost:8080/api/v1/dietists/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchDietists();
  };

  const updateDietist = async (d) => {
    await fetch(`http://localhost:8080/api/v1/dietists/${d.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username: d.username, name: d.name, password: d.password }),
    });
    await fetchDietists();
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Dietists</h1>
      <form onSubmit={createDietist} className="space-x-2">
        <input
          className="input input-bordered"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="input input-bordered"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input input-bordered"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Add</button>
      </form>
      {error && <div className="text-red-500">{error}</div>}
      <ul className="space-y-2">
        {dietists.map((d) => (
          <li key={d.id} className="card bg-base-100 shadow p-4">
            <div className="flex justify-between items-center">
              <div className="flex-1 space-x-2">
                <input
                  className="input input-bordered input-sm"
                  value={d.username}
                  onChange={(e) =>
                    setDietists((prev) => prev.map((x) => (x.id === d.id ? { ...x, username: e.target.value } : x)))
                  }
                />
                <input
                  className="input input-bordered input-sm"
                  value={d.name}
                  onChange={(e) =>
                    setDietists((prev) => prev.map((x) => (x.id === d.id ? { ...x, name: e.target.value } : x)))
                  }
                />
                <input
                  className="input input-bordered input-sm"
                  type="password"
                  value={d.password || ''}
                  onChange={(e) =>
                    setDietists((prev) => prev.map((x) => (x.id === d.id ? { ...x, password: e.target.value } : x)))
                  }
                />
              </div>
              <div className="space-x-2">
                <button className="btn btn-sm" onClick={() => updateDietist(d)}>Save</button>
                <button className="btn btn-sm btn-error" onClick={() => deleteDietist(d.id)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
