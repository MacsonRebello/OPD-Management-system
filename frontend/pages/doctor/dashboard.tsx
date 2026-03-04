import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doctorAPI } from '@/utils/api';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

export default function DoctorDashboard() {
  const router = useRouter();
  const { user, logout, token } = useAuthStore();
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/doctor/login');
      return;
    }

    loadPatients();
  }, [token, selectedDate]);

  const loadPatients = async () => {
    try {
      const response = await doctorAPI.getDoctorPatients(user?.id!, selectedDate);
      setPatients(response.data);
    } catch (error) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleCallNext = async () => {
    try {
      await doctorAPI.callNextPatient(user?.id!, { appointment_date: selectedDate });
      toast.success('Next patient called');
      loadPatients();
    } catch (error) {
      toast.error('Failed to call patient');
    }
  };

  const handleCompleteConsultation = async (appointmentId: number) => {
    try {
      await doctorAPI.completeConsultation(appointmentId);
      toast.success('Consultation completed');
      loadPatients();
    } catch (error) {
      toast.error('Failed to complete consultation');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-green-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">OPD System - Doctor Portal</h1>
          <div className="flex gap-4">
            <span>Dr. {user?.name}</span>
            <button onClick={handleLogout} className="hover:bg-green-700 px-4 py-2 rounded">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={handleCallNext}
              className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition"
            >
              Call Next Patient
            </button>
          </div>
          <p className="text-gray-600">Total Patients: <strong>{patients.length}</strong></p>
        </div>

        {/* Patients Queue */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Patient Queue</h3>
          {patients.length === 0 ? (
            <p className="text-gray-600">No patients in queue</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Token</th>
                    <th className="px-4 py-2 text-left">Patient Name</th>
                    <th className="px-4 py-2 text-left">Time</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Reason</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.appointment_id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-bold text-lg bg-yellow-100">{patient.token_number}</td>
                      <td className="px-4 py-2">{patient.name}</td>
                      <td className="px-4 py-2">{patient.appointment_time}</td>
                      <td className="px-4 py-2">
                        <span className={`px-3 py-1 rounded text-white text-sm font-bold ${
                          patient.status === 'in_progress' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}>
                          {patient.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">{patient.reason || '-'}</td>
                      <td className="px-4 py-2">
                        {patient.status === 'in_progress' && (
                          <button
                            onClick={() => handleCompleteConsultation(patient.appointment_id)}
                            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
                          >
                            Complete
                          </button>
                        )}
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
