'use client';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import AuthContext from '../../context/AuthContext';

export default function Patients() {
  const { token, dietistId } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/patients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load');
      setPatients(await res.json());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [token]);

  const createPatient = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/v1/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, name, dietist_id: dietistId }),
      });
      if (!res.ok) throw new Error('Creation failed');
      setUsername('');
      setName('');
      await fetchPatients();
    } catch (err) {
      setError(err.message);
    }
  };

  const deletePatient = async (id) => {
    await fetch(`http://localhost:8080/api/v1/patients/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchPatients();
  };

  const updatePatient = async (p) => {
    await fetch(`http://localhost:8080/api/v1/patients/${p.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username: p.username, name: p.name, dietist_id: dietistId }),
    });
    await fetchPatients();
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Patients</h1>
      <form onSubmit={createPatient} className="space-x-2">
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
        <button className="btn btn-primary" type="submit">
          Add
        </button>
      </form>
      {error && <div className="text-red-500">{error}</div>}
      <ul className="space-y-2">
        {patients.map((p) => (
          <li key={p.id} className="card bg-base-100 shadow p-4">
            <div className="flex justify-between items-center">
              <div className="flex-1 space-x-2">
                <input
                  className="input input-bordered input-sm"
                  value={p.username}
                  onChange={(e) =>
                    setPatients((prev) =>
                      prev.map((x) => (x.id === p.id ? { ...x, username: e.target.value } : x))
                    )
                  }
                />
                <input
                  className="input input-bordered input-sm"
                  value={p.name}
                  onChange={(e) =>
                    setPatients((prev) =>
                      prev.map((x) => (x.id === p.id ? { ...x, name: e.target.value } : x))
                    )
                  }
                />
              </div>
              <div className="space-x-2">
                <button className="btn btn-sm" onClick={() => updatePatient(p)}>
                  Save
                </button>
                <button className="btn btn-sm btn-error" onClick={() => deletePatient(p.id)}>
                  Delete
                </button>
                <Link className="btn btn-sm btn-secondary" href={`/patients/${p.id}`}>
                  Diets
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
