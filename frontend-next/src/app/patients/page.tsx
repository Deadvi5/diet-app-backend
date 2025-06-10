'use client'
import { useContext, useEffect, useState, FormEvent } from 'react'
import Link from 'next/link'
import AuthContext from '@/context/AuthContext'

type Patient = {
  id: number
  username: string
  name: string
  surname: string
  email: string
  age: number
  height: number
  weight: number
}

export default function Patients() {
  const { token, dietistId } = useContext(AuthContext)
  const [patients, setPatients] = useState<Patient[]>([])
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState(0)
  const [height, setHeight] = useState(0)
  const [weight, setWeight] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const fetchPatients = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/patients', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to load')
      setPatients(await res.json())
    } catch (err: any) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [token])

  const createPatient = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:8080/api/v1/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          name,
          surname,
          email,
          age,
          height,
          weight,
          dietist_id: dietistId,
        }),
      })
      if (!res.ok) throw new Error('Creation failed')
      setUsername('')
      setName('')
      setSurname('')
      setEmail('')
      setAge(0)
      setHeight(0)
      setWeight(0)
      fetchPatients()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const deletePatient = async (id: number) => {
    await fetch(`http://localhost:8080/api/v1/patients/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchPatients()
  }

  const updatePatient = async (p: Patient) => {
    await fetch(`http://localhost:8080/api/v1/patients/${p.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: p.username,
        name: p.name,
        surname: p.surname,
        email: p.email,
        age: p.age,
        height: p.height,
        weight: p.weight,
        dietist_id: dietistId,
      }),
    })
    fetchPatients()
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Patients</h1>
      <form
        onSubmit={createPatient}
        className="card bg-base-100 p-4 space-y-2 md:flex md:items-end md:space-y-0 md:space-x-2"
      >
        <input
          className="input input-bordered flex-1"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="input input-bordered flex-1"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input input-bordered flex-1"
          placeholder="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
        <input
          className="input input-bordered flex-1"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input input-bordered flex-1"
          placeholder="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />
        <input
          className="input input-bordered flex-1"
          placeholder="Height"
          type="number"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
        />
        <input
          className="input input-bordered flex-1"
          placeholder="Weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
        />
        <button className="btn btn-primary" type="submit">
          Add
        </button>
      </form>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Email</th>
              <th>Age</th>
              <th>Height</th>
              <th>Weight</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id}>
                <td>
                  <input
                    className="input input-bordered input-sm w-full"
                    value={p.username}
                    onChange={(e) =>
                      setPatients((prev) =>
                        prev.map((x) => (x.id === p.id ? { ...x, username: e.target.value } : x))
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input input-bordered input-sm w-full"
                    value={p.name}
                    onChange={(e) =>
                      setPatients((prev) =>
                        prev.map((x) => (x.id === p.id ? { ...x, name: e.target.value } : x))
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input input-bordered input-sm w-full"
                    value={p.surname}
                    onChange={(e) =>
                      setPatients((prev) =>
                        prev.map((x) => (x.id === p.id ? { ...x, surname: e.target.value } : x))
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input input-bordered input-sm w-full"
                    value={p.email}
                    onChange={(e) =>
                      setPatients((prev) =>
                        prev.map((x) => (x.id === p.id ? { ...x, email: e.target.value } : x))
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input input-bordered input-sm w-full"
                    type="number"
                    value={p.age}
                    onChange={(e) =>
                      setPatients((prev) =>
                        prev.map((x) => (x.id === p.id ? { ...x, age: Number(e.target.value) } : x))
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input input-bordered input-sm w-full"
                    type="number"
                    value={p.height}
                    onChange={(e) =>
                      setPatients((prev) =>
                        prev.map((x) => (x.id === p.id ? { ...x, height: Number(e.target.value) } : x))
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input input-bordered input-sm w-full"
                    type="number"
                    value={p.weight}
                    onChange={(e) =>
                      setPatients((prev) =>
                        prev.map((x) => (x.id === p.id ? { ...x, weight: Number(e.target.value) } : x))
                      )
                    }
                  />
                </td>
                <td className="space-x-2">
                  <button className="btn btn-sm" onClick={() => updatePatient(p)}>
                    Save
                  </button>
                  <button className="btn btn-sm btn-error" onClick={() => deletePatient(p.id)}>
                    Delete
                  </button>
                  <Link className="btn btn-sm btn-secondary" href={`/patients/${p.id}`}>
                    Diets
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
