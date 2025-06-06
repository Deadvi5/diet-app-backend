import { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaSave, FaTrash, FaListUl, FaPlus } from 'react-icons/fa'
import AuthContext from '../AuthContext'
import Toast from '../components/Toast'

export default function Patients() {
  const { token, dietistId } = useContext(AuthContext)
  const [patients, setPatients] = useState([])
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('name')
  const [openAdd, setOpenAdd] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const fetchPatients = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/patients', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to load')
      setPatients(await res.json())
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [token])

  const createPatient = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:8080/api/v1/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, name, dietist_id: dietistId }),
      })
      if (!res.ok) throw new Error('Creation failed')
      setUsername('')
      setName('')
      setOpenAdd(false)
      await fetchPatients()
      showToast('Patient added')
    } catch (err) {
      setError(err.message)
    }
  }

  const deletePatient = async (id) => {
    if (!confirm('Delete patient?')) return
    await fetch(`http://localhost:8080/api/v1/patients/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    await fetchPatients()
    showToast('Patient deleted')
  }

  const updatePatient = async (p) => {
    await fetch(`http://localhost:8080/api/v1/patients/${p.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username: p.username, name: p.name, dietist_id: dietistId }),
    })
    await fetchPatients()
    showToast('Patient updated')
  }

  const filtered = useMemo(() => {
    return patients
      .filter((p) =>
        [p.name, p.username].some((v) => v.toLowerCase().includes(search.toLowerCase())),
      )
      .sort((a, b) => a[sort].localeCompare(b[sort]))
  }, [patients, search, sort])

  const getInitials = (n) => n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Patients</h1>
        <button className="btn btn-primary btn-sm" onClick={() => setOpenAdd(true)}>
          <FaPlus className="mr-2" /> Add Patient
        </button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="search"
          className="input input-bordered grow"
          placeholder="Search patients"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="select select-bordered" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="name">Sort by name</option>
          <option value="username">Sort by username</option>
        </select>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {filtered.length === 0 ? (
        <div className="text-center py-10 opacity-70">No patients found. Add your first patient!</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table bg-base-100 shadow-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th className="hidden sm:table-cell">Username</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="hover">
                  <td className="flex items-center gap-2 min-w-48">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-8">
                        <span className="text-sm">{getInitials(p.name)}</span>
                      </div>
                    </div>
                    <input
                      className="input input-sm input-bordered flex-1"
                      value={p.name}
                      onChange={(e) =>
                        setPatients((prev) => prev.map((x) => (x.id === p.id ? { ...x, name: e.target.value } : x)))
                      }
                    />
                  </td>
                  <td className="hidden sm:table-cell">
                    <input
                      className="input input-sm input-bordered"
                      value={p.username}
                      onChange={(e) =>
                        setPatients((prev) => prev.map((x) => (x.id === p.id ? { ...x, username: e.target.value } : x)))
                      }
                    />
                  </td>
                  <td className="flex gap-1">
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => updatePatient(p)}
                      data-tip="Save"
                    >
                      <FaSave />
                    </button>
                    <button
                      className="btn btn-ghost btn-xs text-error"
                      onClick={() => deletePatient(p.id)}
                      data-tip="Delete"
                    >
                      <FaTrash />
                    </button>
                    <Link
                      to={`/patients/${p.id}`}
                      className="btn btn-ghost btn-xs"
                      data-tip="Diets"
                    >
                      <FaListUl />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add patient modal */}
      {openAdd && (
        <dialog id="add_modal" className="modal modal-open" onClose={() => setOpenAdd(false)}>
          <form onSubmit={createPatient} method="dialog" className="modal-box space-y-4">
            <h3 className="font-bold text-lg">New Patient</h3>
            <input
              className="input input-bordered w-full"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="input input-bordered w-full"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="modal-action">
              <button type="button" className="btn" onClick={() => setOpenAdd(false)}>
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </dialog>
      )}

      <Toast message={toast} />
    </div>
  )
}
