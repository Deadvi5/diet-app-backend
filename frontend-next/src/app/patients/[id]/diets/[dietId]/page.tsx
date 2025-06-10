'use client'
import { useContext, useEffect, useState, FormEvent } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import AuthContext from '@/context/AuthContext'

interface Dish {
  id: number
  name: string
  description: string
}

export default function DietDishes() {
  const { token } = useContext(AuthContext)
  const params = useParams()
  const patientId = params.id as string
  const dietId = params.dietId as string
  const [diet, setDiet] = useState<any>(null)
  const [dishes, setDishes] = useState<Dish[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const fetchData = async () => {
    const dRes = await fetch(
      `http://localhost:8080/api/v1/patients/${patientId}/diets/${dietId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setDiet(await dRes.json())
    const diRes = await fetch(
      `http://localhost:8080/api/v1/diets/${dietId}/dishes`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setDishes(await diRes.json())
  }

  useEffect(() => {
    fetchData()
  }, [patientId, dietId, token])

  const createDish = async (e: FormEvent) => {
    e.preventDefault()
    await fetch(`http://localhost:8080/api/v1/diets/${dietId}/dishes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, description })
    })
    setName('')
    setDescription('')
    fetchData()
  }

  const updateDish = async (dish: Dish) => {
    await fetch(`http://localhost:8080/api/v1/diets/${dietId}/dishes/${dish.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: dish.name, description: dish.description })
    })
    fetchData()
  }

  const deleteDish = async (dishId: number) => {
    await fetch(`http://localhost:8080/api/v1/diets/${dietId}/dishes/${dishId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchData()
  }

  if (!diet) return <div>Loading...</div>

  return (
    <div className="p-4 space-y-6">
      <Link href={`/patients/${patientId}`} className="btn mb-4">
        Back
      </Link>
      <h2 className="text-xl font-bold mb-2">Dishes for {diet.name}</h2>
      <form
        onSubmit={createDish}
        className="card bg-base-100 p-4 space-y-2 md:flex md:items-end md:space-y-0 md:space-x-2"
      >
        <input
          className="input input-bordered flex-1"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input input-bordered flex-1"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Add
        </button>
      </form>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dishes.map((d) => (
              <tr key={d.id}>
                <td>
                  <input
                    className="input input-bordered input-sm w-full"
                    value={d.name}
                    onChange={(e) =>
                      setDishes((prev) =>
                        prev.map((x) => (x.id === d.id ? { ...x, name: e.target.value } : x))
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    className="input input-bordered input-sm w-full"
                    value={d.description}
                    onChange={(e) =>
                      setDishes((prev) =>
                        prev.map((x) =>
                          x.id === d.id ? { ...x, description: e.target.value } : x
                        )
                      )
                    }
                  />
                </td>
                <td className="space-x-2">
                  <button className="btn btn-sm" onClick={() => updateDish(d)}>
                    Save
                  </button>
                  <button className="btn btn-sm btn-error" onClick={() => deleteDish(d.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
