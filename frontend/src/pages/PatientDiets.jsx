import { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import AuthContext from '../AuthContext'

export default function PatientDiets() {
  const { token } = useContext(AuthContext)
  const { id } = useParams()
  const [patient, setPatient] = useState(null)
  const [diets, setDiets] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const fetchData = async () => {
    const pRes = await fetch(`http://localhost:8080/api/v1/patients/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    setPatient(await pRes.json())
    const dRes = await fetch(`http://localhost:8080/api/v1/patients/${id}/diets`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    setDiets(await dRes.json())
  }

  useEffect(() => { fetchData() }, [id, token])

  const createDiet = async (e) => {
    e.preventDefault()
    await fetch(`http://localhost:8080/api/v1/patients/${id}/diets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    })
    setName('')
    setDescription('')
    fetchData()
  }

  const updateDiet = async (d) => {
    await fetch(`http://localhost:8080/api/v1/patients/${id}/diets/${d.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: d.name, description: d.description }),
    })
    fetchData()
  }

  const deleteDiet = async (dietId) => {
    await fetch(`http://localhost:8080/api/v1/patients/${id}/diets/${dietId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchData()
  }

  if (!patient) return <div>Loading...</div>

  return (
    <div className="p-4 space-y-6">
      <Link to="/patients" className="btn mb-4">Back</Link>
      <h2 className="text-xl font-bold mb-2">Diets for {patient.name}</h2>
      <form
        onSubmit={createDiet}
        className="card bg-base-100 p-4 space-y-2 md:flex md:items-end md:space-y-0 md:space-x-2"
      >
        <input
          className="input input-bordered"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input input-bordered"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Add</button>
      </form>
      <ul className="space-y-2">
        {diets.map((d) => (
          <li key={d.id} className="card bg-base-100 shadow p-4">
            <div className="flex justify-between items-center">
              <div className="flex-1 space-x-2">
                <input
                  className="input input-bordered input-sm"
                  value={d.name}
                  onChange={(e) =>
                    setDiets((prev) => prev.map((x) => (x.id === d.id ? { ...x, name: e.target.value } : x)))
                  }
                />
                <input
                  className="input input-bordered input-sm"
                  value={d.description}
                  onChange={(e) =>
                    setDiets((prev) =>
                      prev.map((x) => (x.id === d.id ? { ...x, description: e.target.value } : x))
                    )
                  }
                />
              </div>
              <div className="space-x-2">
                <button className="btn btn-sm" onClick={() => updateDiet(d)}>Save</button>
                <button className="btn btn-sm btn-error" onClick={() => deleteDiet(d.id)}>
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
