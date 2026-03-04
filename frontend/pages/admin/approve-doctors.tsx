import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doctorAPI } from '@/utils/api';
import toast from 'react-hot-toast';

export default function ApproveDoctors() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    specialization: '',
    experience: 0,
    is_active: true,
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const response = await doctorAPI.getAllDoctors();
      setDoctors(response.data);
    } catch (error) {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'experience' ? parseInt(value) : value),
    }));
  };

  const handleEdit = (doctor: any) => {
    setEditingId(doctor.doctor_id);
    setForm({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      department: doctor.department,
      specialization: doctor.specialization || '',
      experience: doctor.experience || 0,
      is_active: doctor.is_active,
    });
  };

  const handleApprove = async (id: number) => {
    try {
      await doctorAPI.updateDoctor(id, {
        ...form,
        is_active: true,
      });
      toast.success('Doctor approved successfully');
      setEditingId(null);
      loadDoctors();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleReject = async (id: number) => {
    if (confirm('Are you sure you want to reject this doctor?')) {
      try {
        await doctorAPI.updateDoctor(id, {
          is_active: false,
        });
        toast.success('Doctor rejected');
        setEditingId(null);
        loadDoctors();
      } catch (error: any) {
        toast.error('Operation failed');
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const pendingDoctors = doctors.filter((d) => !d.is_active);
  const activeDoctors = doctors.filter((d) => d.is_active);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-purple-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Approve Doctors</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/')}
              className="hover:bg-purple-700 px-4 py-2 rounded transition"
            >
              Home
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Pending Doctors Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Pending Approvals ({pendingDoctors.length})
          </h2>

          {pendingDoctors.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
              <p>No pending doctor approvals</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingDoctors.map((doctor) => (
                <div key={doctor.doctor_id} className="bg-white rounded-lg shadow-lg p-6">
                  {editingId === doctor.doctor_id ? (
                    // Edit Form
                    <div>
                      <h3 className="text-xl font-bold mb-4">Review & Approve Doctor</h3>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Name</label>
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Department</label>
                          <input
                            type="text"
                            name="department"
                            value={form.department}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Specialization</label>
                          <input
                            type="text"
                            name="specialization"
                            value={form.specialization}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">Experience (Years)</label>
                          <input
                            type="number"
                            name="experience"
                            value={form.experience}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          onClick={() => handleApprove(doctor.doctor_id)}
                          className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition"
                        >
                          Approve Doctor
                        </button>
                        <button
                          onClick={() => handleReject(doctor.doctor_id)}
                          className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-400 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">{doctor.name}</h3>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-gray-600 text-sm">Email</p>
                            <p className="font-medium">{doctor.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Phone</p>
                            <p className="font-medium">{doctor.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Department</p>
                            <p className="font-medium">{doctor.department}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Specialization</p>
                            <p className="font-medium">{doctor.specialization || '-'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Experience</p>
                            <p className="font-medium">{doctor.experience || 0} years</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(doctor)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                          Review & Approve
                        </button>
                        <button
                          onClick={() => handleReject(doctor.doctor_id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Doctors Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Approved Doctors ({activeDoctors.length})
          </h2>

          {activeDoctors.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
              <p>No approved doctors yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-left">Department</th>
                    <th className="px-4 py-3 text-left">Specialization</th>
                    <th className="px-4 py-3 text-left">Experience</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeDoctors.map((doctor) => (
                    <tr key={doctor.doctor_id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{doctor.name}</td>
                      <td className="px-4 py-3 text-sm">{doctor.email}</td>
                      <td className="px-4 py-3 text-sm">{doctor.phone}</td>
                      <td className="px-4 py-3 text-sm">{doctor.department}</td>
                      <td className="px-4 py-3 text-sm">{doctor.specialization || '-'}</td>
                      <td className="px-4 py-3 text-sm">{doctor.experience || 0} years</td>
                      <td className="px-4 py-3">
                        <span className="bg-green-500 text-white px-3 py-1 rounded text-sm font-bold">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
