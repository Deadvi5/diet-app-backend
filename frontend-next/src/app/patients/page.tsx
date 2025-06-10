"use client"
import React, { useState, useEffect, useContext } from 'react';
import { Search, Plus, User, Mail, Calendar, Ruler, Weight, Edit3, Trash2, BookOpen, Filter, Download, MoreVertical, X } from 'lucide-react';
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

const PatientsPage = () => {
  const { token, dietistId } = useContext(AuthContext);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state for new patient
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);

  // Fetch patients function
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/v1/patients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load patients');
      const data = await res.json();
      setPatients(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create patient function
  const createPatient = async () => {
    if (!username || !name || !surname || !email || !age || !height || !weight) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
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
      });
      if (!res.ok) throw new Error('Creation failed');

      // Reset form
      setUsername('');
      setName('');
      setSurname('');
      setEmail('');
      setAge(0);
      setHeight(0);
      setWeight(0);
      setShowAddForm(false);
      setError(null);

      // Refresh patients list
      fetchPatients();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete patient function
  const deletePatient = async (id: number) => {
    if (!confirm('Are you sure you want to delete this patient?')) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/patients/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');

      fetchPatients();
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update patient function
  const updatePatient = async (patient: Patient) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/patients/${patient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: patient.username,
          name: patient.name,
          surname: patient.surname,
          email: patient.email,
          age: patient.age,
          height: patient.height,
          weight: patient.weight,
          dietist_id: dietistId,
        }),
      });
      if (!res.ok) throw new Error('Update failed');

      setEditingPatient(null);
      fetchPatients();
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update patient field in state
  const updatePatientField = (patientId: number, field: string, value: any) => {
    setPatients(prev =>
        prev.map(p =>
            p.id === patientId
                ? { ...p, [field]: field === 'age' || field === 'height' || field === 'weight' ? Number(value) : value }
                : p
        )
    );
  };

  useEffect(() => {
    fetchPatients();
  }, [token]);

  const filteredPatients = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateBMI = (weight: number, height: number) => {
    if (!weight || !height) return '0.0';
    const heightInM = height / 100;
    return (weight / (heightInM * heightInM)).toFixed(1);
  };

  const getBMICategory = (bmi: string) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { text: 'Underweight', color: 'badge-info' };
    if (bmiValue < 25) return { text: 'Normal', color: 'badge-success' };
    if (bmiValue < 30) return { text: 'Overweight', color: 'badge-warning' };
    return { text: 'Obese', color: 'badge-error' };
  };

  const activePatients = patients.length;

  return (
      <div className="min-h-screen bg-base-200">
        {/* Header */}
        <div className="bg-base-100 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold">Patient Management</h1>
                <p className="mt-1 text-sm opacity-70">Manage your patients and their health data</p>
              </div>
              <div className="flex gap-3">
                <button className="btn btn-outline btn-sm">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button
                    onClick={() => setShowAddForm(true)}
                    disabled={loading}
                    className="btn btn-primary btn-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Patient
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Alert */}
          {error && (
              <div className="alert alert-error mb-6">
                <X className="h-5 w-5" />
                <span>{error}</span>
                <button
                    onClick={() => setError(null)}
                    className="btn btn-sm btn-circle btn-ghost"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium opacity-70">Total Patients</p>
                    <p className="text-2xl font-bold">{patients.length}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="p-3 bg-success/10 rounded-lg">
                    <User className="w-6 h-6 text-success" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium opacity-70">Active Patients</p>
                    <p className="text-2xl font-bold">{activePatients}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="p-3 bg-warning/10 rounded-lg">
                    <Calendar className="w-6 h-6 text-warning" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium opacity-70">This Week</p>
                    <p className="text-2xl font-bold">-</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <BookOpen className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium opacity-70">Active Plans</p>
                    <p className="text-2xl font-bold">-</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="card bg-base-100 shadow-sm mb-8">
            <div className="card-body">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="form-control flex-1">
                  <div className="input-group">
                    <span className="bg-base-200">
                      <Search className="w-5 h-5" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search patients by name, username, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input input-bordered flex-1"
                    />
                  </div>
                </div>
                <button className="btn btn-outline">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
              <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
          )}

          {/* Patients Grid */}
          {!loading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPatients.map((patient) => {
                  const bmi = calculateBMI(patient.weight, patient.height);
                  const bmiCategory = getBMICategory(bmi);
                  const isEditing = editingPatient === patient.id;

                  return (
                      <div key={patient.id} className="card bg-base-100 shadow-sm hover:shadow-lg transition-all duration-200">
                        <div className="card-body">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="avatar placeholder">
                                <div className="bg-primary text-primary-content rounded-full w-12">
                                  <span className="text-lg font-semibold">
                                    {patient.name.charAt(0)}{patient.surname.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div>
                                {isEditing ? (
                                    <div className="space-y-1">
                                      <div className="flex gap-1">
                                        <input
                                            type="text"
                                            value={patient.name}
                                            onChange={(e) => updatePatientField(patient.id, 'name', e.target.value)}
                                            className="input input-xs input-bordered w-16"
                                        />
                                        <input
                                            type="text"
                                            value={patient.surname}
                                            onChange={(e) => updatePatientField(patient.id, 'surname', e.target.value)}
                                            className="input input-xs input-bordered w-20"
                                        />
                                      </div>
                                      <input
                                          type="text"
                                          value={patient.username}
                                          onChange={(e) => updatePatientField(patient.id, 'username', e.target.value)}
                                          className="input input-xs input-bordered w-24"
                                      />
                                    </div>
                                ) : (
                                    <div>
                                      <h3 className="font-semibold text-lg">{patient.name} {patient.surname}</h3>
                                      <p className="text-sm opacity-70">@{patient.username}</p>
                                    </div>
                                )}
                              </div>
                            </div>
                            <div className="dropdown dropdown-end">
                              <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
                                <MoreVertical className="w-4 h-4" />
                              </label>
                            </div>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div className="flex items-center text-sm">
                              <Mail className="w-4 h-4 mr-2 opacity-70" />
                              {isEditing ? (
                                  <input
                                      type="email"
                                      value={patient.email}
                                      onChange={(e) => updatePatientField(patient.id, 'email', e.target.value)}
                                      className="input input-xs input-bordered flex-1"
                                  />
                              ) : (
                                  patient.email
                              )}
                            </div>
                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 mr-2 opacity-70" />
                              Age: {isEditing ? (
                                <input
                                    type="number"
                                    value={patient.age}
                                    onChange={(e) => updatePatientField(patient.id, 'age', e.target.value)}
                                    className="input input-xs input-bordered w-16 ml-1"
                                />
                            ) : (
                                patient.age
                            )} years
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                              <div className="flex items-center justify-center opacity-70 mb-1">
                                <Ruler className="w-4 h-4" />
                              </div>
                              {isEditing ? (
                                  <input
                                      type="number"
                                      value={patient.height}
                                      onChange={(e) => updatePatientField(patient.id, 'height', e.target.value)}
                                      className="input input-xs input-bordered w-full text-center"
                                  />
                              ) : (
                                  <p className="text-sm font-medium">{patient.height} cm</p>
                              )}
                              <p className="text-xs opacity-70">Height</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center opacity-70 mb-1">
                                <Weight className="w-4 h-4" />
                              </div>
                              {isEditing ? (
                                  <input
                                      type="number"
                                      value={patient.weight}
                                      onChange={(e) => updatePatientField(patient.id, 'weight', e.target.value)}
                                      className="input input-xs input-bordered w-full text-center"
                                  />
                              ) : (
                                  <p className="text-sm font-medium">{patient.weight} kg</p>
                              )}
                              <p className="text-xs opacity-70">Weight</p>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium">{bmi}</div>
                              <div className={`badge badge-sm ${bmiCategory.color}`}>
                                {bmiCategory.text}
                              </div>
                            </div>
                          </div>

                          <div className="card-actions justify-between">
                            {isEditing ? (
                                <>
                                  <button
                                      onClick={() => updatePatient(patient)}
                                      disabled={loading}
                                      className="btn btn-success btn-sm flex-1"
                                  >
                                    Save
                                  </button>
                                  <button
                                      onClick={() => setEditingPatient(null)}
                                      className="btn btn-outline btn-sm flex-1"
                                  >
                                    Cancel
                                  </button>
                                </>
                            ) : (
                                <>
                                  <button
                                      onClick={() => setEditingPatient(patient.id)}
                                      className="btn btn-outline btn-sm flex-1"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                    Edit
                                  </button>
                                  <button className="btn btn-primary btn-sm flex-1">
                                    <BookOpen className="w-4 h-4" />
                                    Diets
                                  </button>
                                </>
                            )}
                            <button
                                onClick={() => deletePatient(patient.id)}
                                disabled={loading}
                                className="btn btn-error btn-sm btn-outline"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                  );
                })}
              </div>
          )}
        </div>

        {/* Add Patient Modal */}
        {showAddForm && (
            <div className="modal modal-open">
              <div className="modal-box max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Add New Patient</h2>
                    <p className="text-sm opacity-70 mt-1">Enter patient information to create a new profile</p>
                  </div>
                  <button
                      onClick={() => setShowAddForm(false)}
                      className="btn btn-sm btn-circle btn-ghost"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Username</span>
                      </label>
                      <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="input input-bordered"
                          placeholder="Enter username"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input input-bordered"
                          placeholder="Enter email"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">First Name</span>
                      </label>
                      <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="input input-bordered"
                          placeholder="Enter first name"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Last Name</span>
                      </label>
                      <input
                          type="text"
                          value={surname}
                          onChange={(e) => setSurname(e.target.value)}
                          className="input input-bordered"
                          placeholder="Enter last name"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Age</span>
                      </label>
                      <input
                          type="number"
                          min="1"
                          max="120"
                          value={age}
                          onChange={(e) => setAge(Number(e.target.value))}
                          className="input input-bordered"
                          placeholder="Enter age"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Height (cm)</span>
                      </label>
                      <input
                          type="number"
                          min="50"
                          max="250"
                          value={height}
                          onChange={(e) => setHeight(Number(e.target.value))}
                          className="input input-bordered"
                          placeholder="Enter height in cm"
                      />
                    </div>

                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text">Weight (kg)</span>
                      </label>
                      <input
                          type="number"
                          min="20"
                          max="300"
                          step="0.1"
                          value={weight}
                          onChange={(e) => setWeight(Number(e.target.value))}
                          className="input input-bordered"
                          placeholder="Enter weight in kg"
                      />
                    </div>
                  </div>

                  <div className="modal-action">
                    <button
                        onClick={() => setShowAddForm(false)}
                        className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                        onClick={createPatient}
                        disabled={loading}
                        className="btn btn-primary"
                    >
                      {loading ? 'Adding...' : 'Add Patient'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default PatientsPage;